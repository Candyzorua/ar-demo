import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { VtoService } from 'src/services/vto-service/vto.service';

@Component({
  selector: 'app-barefoot-vto',
  templateUrl: './barefoot-vto.component.html',
  styleUrls: ['./barefoot-vto.component.scss']
})
export class BarefootVtoComponent {
  public shoeRightPath!: BehaviorSubject<string>;
  public scanSettings: any = {
    translationScalingFactors: [0.3, 0.3, 1],
    multiDetectionSearchSlotsRate: 0.5,
    multiDetectionEqualizeSearchSlotScale: true,
    multiDetectionForceSearchOnOtherSide: true
  };

  constructor(
    private vtoService: VtoService
  ) {
    this.shoeRightPath = this.vtoService.getShoeRightPath();
  }
}
