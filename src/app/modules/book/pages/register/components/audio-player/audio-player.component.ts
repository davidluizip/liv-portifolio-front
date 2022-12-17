import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { BehaviorSubject, filter, shareReplay, Subject, takeUntil } from 'rxjs';

const ICONS = {
  play: 'play.svg',
  pause: 'pause.svg',
} as const;

type PlayerIcon = typeof ICONS[keyof typeof ICONS];

type StreamState = {
  src: SafeResourceUrl | null;
  playing: PlayingState;
};

enum PlayingState {
  stop = 'stop',
  play = 'play',
  pause = 'pause',
}

@Component({
  selector: 'liv-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
})
export class AudioPlayerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('audioRef') audio: ElementRef<HTMLAudioElement>;

  @Input() set src(value: SafeResourceUrl) {
    const state = this.state.getValue();
    state.src = value;
    this.state.next(state);

    if (this.audio.nativeElement && state.src) {
      this.audio.nativeElement.load();
    }
  }

  public state = new BehaviorSubject<StreamState>({
    src: null,
    playing: PlayingState.stop,
  });
  public state$ = this.state.asObservable();

  public readonly PlayingStateEnum = PlayingState;
  public playerIcon: PlayerIcon = 'play.svg';
  public dispatchPlay = new BehaviorSubject<boolean>(false);

  private destroy$ = new Subject<boolean>();
  private volume = 0.5;

  ngOnDestroy(): void {
    URL.revokeObjectURL(this.audio.nativeElement.src);

    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => (this.audio.nativeElement.volume = this.volume));

    this.state$
      .pipe(
        takeUntil(this.destroy$),
        filter(({ playing, src }) => playing !== PlayingState.stop && !!src),
        shareReplay()
      )
      .subscribe(({ playing }) => {
        if (playing === PlayingState.play) {
          this.audio.nativeElement.play();
          this.playerIcon = 'pause.svg';
        } else {
          this.audio.nativeElement.pause();
          this.playerIcon = 'play.svg';
        }
      });
  }

  handleTogglePlay(event: Event): void {
    event.stopPropagation();

    const state = this.state.getValue();

    state.playing =
      state.playing === PlayingState.play
        ? PlayingState.pause
        : PlayingState.play;

    this.state.next(state);
  }
}
