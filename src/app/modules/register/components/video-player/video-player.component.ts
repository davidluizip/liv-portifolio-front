import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { BehaviorSubject, filter, shareReplay, Subject, takeUntil } from 'rxjs';

const ICONS = {
  play: 'play.svg',
  pause: 'pause.svg'
} as const;

type PlayerIcon = (typeof ICONS)[keyof typeof ICONS];

type StreamState = {
  src: SafeResourceUrl | null;
  playing: PlayingState;
};

enum PlayingState {
  stop = 'stop',
  play = 'play',
  pause = 'pause'
}

@Component({
  selector: 'liv-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnDestroy, AfterViewInit {
  @ViewChild('videoRef') video: ElementRef<HTMLVideoElement | undefined> | null;

  @Input() set src(value: SafeResourceUrl) {
    const state = this.state.getValue();
    state.src = value;
    this.state.next(state);

    if (this.video?.nativeElement && state.src) {
      this.video.nativeElement.load();
    }
  }

  public state = new BehaviorSubject<StreamState>({
    src: null,
    playing: PlayingState.stop
  });
  public state$ = this.state.asObservable();

  public readonly PlayingStateEnum = PlayingState;
  public playerIcon: PlayerIcon = 'play.svg';
  public dispatchPlay = new BehaviorSubject<boolean>(false);

  private destroy$ = new Subject<boolean>();
  private volume = 0.5;

  ngOnDestroy(): void {
    if (this.video?.nativeElement?.src) {
      URL.revokeObjectURL(this.video.nativeElement.src);
    }
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => {
      if (this.video?.nativeElement) {
        this.video.nativeElement.volume = this.volume;
        this.video.nativeElement.controls = false;
      }
    });

    this.state$
      .pipe(
        takeUntil(this.destroy$),
        filter(({ playing, src }) => playing !== PlayingState.stop && !!src),
        shareReplay()
      )
      .subscribe(({ playing }) => {
        if (playing === PlayingState.play) {
          this.video?.nativeElement?.play();
          this.playerIcon = 'pause.svg';
        } else {
          this.video?.nativeElement?.pause();
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
