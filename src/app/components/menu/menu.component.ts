import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { appName } from 'src/app/utils/strings';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [IonicModule],
})
export class MenuComponent  implements OnInit {
  appName: string = appName;
  username: string = '';
  useremail: string = '';

  constructor() { }

  ngOnInit() {}

}
