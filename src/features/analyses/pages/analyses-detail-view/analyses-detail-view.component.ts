import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-analyses-detail-view',
  templateUrl: './analyses-detail-view.component.html',
  styleUrls: ['./analyses-detail-view.component.scss']
})
export class AnalysesDetailViewComponent implements OnInit {
  analysisId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.analysisId = this.route.snapshot.paramMap.get('id');
  }
}