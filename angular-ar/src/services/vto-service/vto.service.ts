import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VtoService {
  private DEFAULT_SHOE_RIGHT_PATH: string = '../../assets/3d-models/vansShoe.glb';
  public shoeRightPath: BehaviorSubject<string> = new BehaviorSubject(this.DEFAULT_SHOE_RIGHT_PATH);

  constructor() { 

  }

  getDefaultShoeRightPath(): string {
    return this.DEFAULT_SHOE_RIGHT_PATH;
  }

  getShoeRightPath(): BehaviorSubject<string> {
    return this.shoeRightPath;
  }

  changeShoeRightPath(newPath: string): void {
    this.shoeRightPath.next(newPath);
  }
}
