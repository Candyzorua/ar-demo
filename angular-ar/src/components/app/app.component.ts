import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private DEFAULT_SHOE_RIGHT_PATH: string = '../../assets/3d-models/barefoot-models/vansShoe.glb'
  public shoeRightPath: BehaviorSubject<string> = new BehaviorSubject(this.DEFAULT_SHOE_RIGHT_PATH)

  public swapShoe(shoeRightPath: string): void {
    this.shoeRightPath.next(shoeRightPath);
  }
}
