import {Component, OnInit, Input} from '@angular/core';

import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {HeroService} from '../hero.service';

import {Hero} from '../hero';
@Component({
  selector: 'app-heroes-detail',
  templateUrl: './heroes-detail.component.html',
  styleUrls: ['./heroes-detail.component.css']
})
export class HeroesDetailComponent implements OnInit {
  @Input() hero: Hero;
  constructor(
    private route: ActivatedRoute,
    private hs: HeroService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.hs.getHero(id).subscribe(hero => this.hero = hero);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.hs.updateHero(this.hero).subscribe(() => this.goBack());
  }

  deleteHero(): void {
    this.hs.deleteHero(this.hero).subscribe();
    this.location.back();
  }

}
