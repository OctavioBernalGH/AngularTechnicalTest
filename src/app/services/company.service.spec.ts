import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CompanyService } from './company.service';
import { Company } from '../models/company.model';

describe('CompanyService', () => {
  let service: CompanyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CompanyService]
    });
    service = TestBed.inject(CompanyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all companies', () => {
    const mockCompanies: Company[] = [
      {
        id: 1,
        name: "Apple Corps Ltd",
        country: "Colombia",
        createYear: 1968,
        employees: 2000,
        rating: 8.32,
        songs: [2, 3]
      }
    ];

    service.getAllCompanies().subscribe(companies => {
      expect(companies.length).toBe(1);
      expect(companies).toEqual(mockCompanies);
    });

    const req = httpMock.expectOne('http://localhost:3000/companies');
    expect(req.request.method).toBe('GET');
    req.flush(mockCompanies);
  });

  it('should get a company by id', () => {
    const mockCompany: Company = {
      id: 1,
      name: "Apple Corps Ltd",
      country: "Colombia",
      createYear: 1968,
      employees: 2000,
      rating: 8.32,
      songs: [2, 3]
    };

    service.getCompanyById(1).subscribe(company => {
      expect(company).toEqual(mockCompany);
    });

    const req = httpMock.expectOne('http://localhost:3000/companies/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockCompany);
  });
});