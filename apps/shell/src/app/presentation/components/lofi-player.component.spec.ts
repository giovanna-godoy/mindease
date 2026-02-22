jest.mock('@angular/common', () => ({ CommonModule: {} }));
jest.mock('@angular/material/icon', () => ({ MatIconModule: {} }));

import { LofiPlayerComponent } from './lofi-player.component';

describe('LofiPlayerComponent', () => {
  let component: LofiPlayerComponent;

  beforeEach(() => {
    component = new LofiPlayerComponent();
    (global as any).Audio = jest.fn().mockImplementation(() => ({
      play: jest.fn().mockResolvedValue(undefined),
      pause: jest.fn(),
      load: jest.fn(),
      addEventListener: jest.fn(),
      volume: 0.5,
      src: '',
      crossOrigin: ''
    }));
  });

  test('togglePlay switches isPlaying state', () => {
    expect(component.isPlaying()).toBe(false);
    component.togglePlay();
    expect(component.isPlaying()).toBe(true);
  });

  test('nextTrack cycles to next track', () => {
    expect(component.currentTrackIndex()).toBe(0);
    component.nextTrack();
    expect(component.currentTrackIndex()).toBe(1);
  });

  test('setVolume updates volume', () => {
    const event = { target: { value: '75' } } as any;
    component.setVolume(event);
    expect(component.volume()).toBe(75);
  });

  test('ngOnDestroy pauses audio', () => {
    const pauseSpy = jest.spyOn(component['audio']!, 'pause');
    component.ngOnDestroy();
    expect(pauseSpy).toHaveBeenCalled();
  });
});
