import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  ngOnInit() {
    const xmr = new XMLHttpRequest();
    xmr.open('GET', 'assets/symbol-defs.svg', true);
    xmr.send();

    xmr.onload = () => {
      const div = document.createElement('div');
      div.innerHTML = xmr.responseText;
      document.body.insertBefore(div, document.body.childNodes[0]);
    };
  }
}
