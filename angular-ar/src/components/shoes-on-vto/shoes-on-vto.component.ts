import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { VtoService } from 'src/services/vto-service/vto.service';

@Component({
  selector: 'app-shoes-on-vto',
  templateUrl: './shoes-on-vto.component.html',
  styleUrls: ['./shoes-on-vto.component.scss']
})
export class ShoesOnVtoComponent {
  public shoeRightPath!: BehaviorSubject<string>;
  public scanSettings: any = {
    multiDetectionSearchSlotsRate: 0.5,
    multiDetectionMaxOverlap: 0.3,
    multiDetectionOverlapScaleXY: [0.5, 1],
    multiDetectionEqualizeSearchSlotScale: true, 
    multiDetectionForceSearchOnOtherSide: true,
    multiDetectionForceChirality: 1,
    disableIsRightHandNNEval: true,
    overlapFactors: [1.0, 1.0, 1.0],
    translationScalingFactors: [0.3, 0.3, 1],
    nScaleLevels: 2, // in the higher scale level, the size of the detection window is the smallest video dimension
    scale0Factor: 0.5
  }

  constructor(
    private vtoService: VtoService
  ) {
    this.shoeRightPath = this.vtoService.getShoeRightPath();
  }
}
