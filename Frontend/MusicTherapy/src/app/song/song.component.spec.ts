import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SongComponent } from './song.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

describe('SongComponent', () => {
  let component: any;
  let fixture: ComponentFixture<SongComponent>;
  let toastrService: ToastrService;
  let httpTestingController: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SongComponent ],
      imports: [ 
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        FormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongComponent);
    component = fixture.componentInstance;
    toastrService = TestBed.inject(ToastrService);
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  it('should validate email correctly', () => {
    const validEmail = 'test@example.com';
    const invalidEmail = 'invalid-email';

    expect(component.ValidateEmail(validEmail)).toBeTrue();
    expect(component.ValidateEmail(invalidEmail)).toBeFalse();
  });

  it('should fetch video ID for a song', async () => {
    const mockResponse = {
      json: () => Promise.resolve({
        items: [{ id: { videoId: 'video-id' } }]
      })
    };

    spyOn(window, 'fetch').and.returnValue(Promise.resolve(mockResponse as any));

    await component.fetchVideoId('song-name');
    expect(component.id).toBe('video-id');
  });

  it('should show success message and schedule therapy on form submit', () => {
    spyOn(toastrService, 'success');
    spyOn(component.http, 'post').and.returnValue({ subscribe: () => {} });

    component.selectedHr = '10';
    component.selectedMin = '30';
    component.selectedAmPm = 'AM';
    component.email = 'test@example.com';

    component.OnSubmit({} as any);

    expect(toastrService.success).toHaveBeenCalledWith('Scheduled Successfully', 'Done', {
      progressBar: true
    });
    expect(component.http.post).toHaveBeenCalledOnceWith(jasmine.any(String), jasmine.any(Object));
  });
});
