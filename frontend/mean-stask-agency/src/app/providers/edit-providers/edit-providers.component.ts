import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProviderClass } from 'src/app/models/providers.class';
import { ProviderService } from 'src/app/services/provider.service';

@Component({
  selector: 'app-edit-providers',
  templateUrl: './edit-providers.component.html',
  styles: [
  ]
})
export class EditProvidersComponent implements OnInit {

  submitted = false;
  emailError = false;
  emailErrorMsg = "Invalid email. Try again or contact us."
  providers: ProviderClass[];
  provider = new ProviderClass();
  providersForm!: FormGroup;

  id: number = 0;     // Service provider's id from URL
  email: string = '';  // Service provider's default email
  ready = false    // Load form only when data are present

  constructor(private providerService: ProviderService, private route: ActivatedRoute) {
    this.providers = [];
  }

  ngOnInit(): void {
    this.buildFormControls();
    this.loadData();

    this.route.paramMap.
      subscribe(params => this.id = parseInt(params.get('id') ?? '0'));

    this.providerService.getProvider(this.id)
      .subscribe({
        next: data => {
          this.provider = data[0];
          console.log(data)

          // flatten object
          const temp: { [key: string]: any } = {};
          for (const [k1, v1] of Object.entries(this.provider)) {
            switch (k1) {
              case '_id' || 'id': break;
              case 'company':
                for (const [k2, v2] of Object.entries(this.provider[k1])) {
                  if(k2 != "_id"){
                    temp[k2] = v2;
                  }
                }
                break;
              default:
                temp[k1] = v1;
            }
          }
          console.log(temp);
          // setTimeout(()=>{                         // this is time to load page 2 sec
            this.providersForm.patchValue(temp);
            this.ready = true;
          // }, 2000)
        },
        error: error => console.log(error)
      });
  }

  // Method to easy access  form controls
  get f() {
    return this.providersForm.controls;
  }

  handleSubmit() {
    console.log(this.providersForm.value);
    this.buildProvider();
    if (!this.isInvalidEmail()) {
      this.providerService.updateProvider(this.id, this.provider)
        .subscribe(
          data => {
            this.submitted = true;
            this.emailError = false;
          },
          error => console.log(error)

        )
    }

    // providers.push(this.provider);
    // this.submitted = true;
  }

  // Get all records from database
  loadData() {
    this.providerService.getProviders()
      .subscribe({
        next: (data) => {
          this.providers = data;
        },
        error: (error) => {
          console.log(error);
        }
      });
  }

  // Check for duplicate emails
  isInvalidEmail() {
    let email = this.providersForm.get('email')?.value;
    if (this.email == email && this.providers.filter(el => el.company.email == email).length > 0) {
      this.emailError = true;
      return true;
    }
    return false;
  }

  // Generate new id
  getNewId() {
    let newId: number;
    while (true) {
      newId = Math.floor(Math.random() * 10000) + 99999;
      if (this.providers.findIndex(el => el.id == newId) == -1) {
        return newId;
      }
    }
  }

  // Build new provider object
  buildProvider() {
    let p = this.providersForm.value;
    this.provider.id = this.getNewId();
    this.provider.firstname = p.firstname;
    this.provider.lastname = p.lastname;
    this.provider.position = p.position;
    this.provider.company = {
      company_name: p.company_name,
      address: p.address,
      address2: p.address2,
      city: p.city,
      state: p.state,
      postal_code: p.postal_code,
      phone: p.phone,
      email: p.email,
      description: p.description,
      tagline: p.tagline,
    };
  }

  // Build form controls

  buildFormControls() {
    this.providersForm = new FormGroup({
      firstname: new FormControl('Christian', [Validators.required, Validators.minLength(2)]),
      lastname: new FormControl('Hur'),
      position: new FormControl(),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern('^[2-9]{3}-[0-9]{3}-[0-9]{4}$')]),
      company_name: new FormControl(),
      address: new FormControl(),
      address2: new FormControl(),
      city: new FormControl(),
      state: new FormControl(),
      postal_code: new FormControl(),
      description: new FormControl(),
      tagline: new FormControl(),
    });
  }

}
