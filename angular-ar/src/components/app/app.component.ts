import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { VtoService } from 'src/services/vto-service/vto.service';
declare var WEBARROCKSHAND: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  public shoeRightPath!: BehaviorSubject<string>;

  constructor(
    private vtoService: VtoService,
    private router: Router
  ) {
    this.shoeRightPath = vtoService.getShoeRightPath();
  }

  swapShoe(shoeRightPath: string): void {
    this.shoeRightPath.next(shoeRightPath);
  }

  switchMode(path: string) {
    WEBARROCKSHAND.destroy().then(() => {
    this.router.navigate(['/' + path]);
    });
  }
}
