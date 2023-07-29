import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderService } from 'src/app/services/provider.service';

@Component({
  selector: 'app-details-providers',
  templateUrl: './details-providers.component.html',
  styles: [
  ]
})
export class DetailsProvidersComponent implements OnInit {
  id: number = 0;
  company: any;

  constructor(private providerService: ProviderService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe(params => this.id = parseInt(params.get('id') || '0'));
    this.getProviderDetails();
  }

  getProviderDetails() {
    this.providerService.getProvider(this.id)
      .subscribe({
        next: (data: any) => {
          if (data && data[0]) {
            this.company = data[0].company;
            // Додати перевірку на пустоту для полів address2, city і phone
            // this.company.address2 = this.company.address2 || '';
            // this.company.city = this.company.city || '';
            // this.company.phone = this.company.phone || '';
          }
        },
        error: (error: any) => console.log(error)
      });
  }
}


// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-details-providers',
//   templateUrl: './details-providers.component.html',
//   styles: [
//   ]
// })
// export class DetailsProvidersComponent {

// }
