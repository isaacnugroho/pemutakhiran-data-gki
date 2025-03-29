import { useEffect, useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Loading data...');
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mark component as mounted (client-side only)
    setIsMounted(true);
    
    // This will run on the client side after the component mounts
    import('../public/script.js').then((module) => {
      // Script is loaded
      console.log('Script loaded');
    });
  }, []);

  // Only render the full content on the client side to avoid hydration issues
  if (!isMounted) {
    return (
      <div>
        <Head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Form to Google Form</title>
        </Head>
        <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Form to Google Form</title>
      </Head>

      <header>
        <nav className="teal">
          <div className="nav-wrapper container">
            <a href="#" className="brand-logo">Data Form</a>
          </div>
        </nav>
      </header>

      <main>
        <div className="container">
          <div className="row">
            <div className="col s12">
              {/* Progress indicator for loading data */}
              <div id="loadingIndicator" className="center-align">
                <div className="progress-container">
                  <div className="preloader-wrapper active">
                    <div className="spinner-layer spinner-teal-only">
                      <div className="circle-clipper left">
                        <div className="circle"></div>
                      </div>
                      <div className="gap-patch">
                        <div className="circle"></div>
                      </div>
                      <div className="circle-clipper right">
                        <div className="circle"></div>
                      </div>
                    </div>
                  </div>
                  <p id="loadingText" className="loading-text">{loadingText}</p>
                </div>
              </div>

              <div className="card z-depth-2">
                <div className="card-content">
                  <span className="card-title center-align">Contact Information</span>
                  <form id="contactForm">
                    <div className="row">
                      {/* Personal Information Section */}
                      <div className="col s12">
                        <h6 className="section-title teal-text">Personal Information</h6>
                        <div className="divider"></div>
                        <p className="mandatory-note"><span className="mandatory-indicator">*</span> Menandakan kolom yang wajib diisi</p>
                      </div>

                      <div className="input-field col s12">
                        <i className="material-icons prefix">account_circle</i>
                        <input type="text" id="name" name="name" className="validate" required />
                        <label htmlFor="name">Nama lengkap<span className="mandatory-indicator">*</span></label>
                        <span className="helper-text" data-error="This field is required"></span>
                      </div>

                      <div className="input-field col s12" style={{ display: 'none' }}>
                        <i className="material-icons prefix">email</i>
                        <input type="email" id="email" name="email" className="validate" />
                        <label htmlFor="email">Email</label>
                        <span className="helper-text" data-error="Please enter a valid email"></span>
                      </div>

                      <div className="input-field col s12">
                        <i className="material-icons prefix">phone</i>
                        <input type="tel" id="phone" name="phone" className="validate" required />
                        <label htmlFor="phone">No. Telepon<span className="mandatory-indicator">*</span></label>
                      </div>

                      <div className="input-field col s12">
                        <i className="material-icons prefix">location_city</i>
                        <input type="text" id="birthPlace" name="birthPlace" className="validate" />
                        <label htmlFor="birthPlace">Tempat Lahir</label>
                      </div>

                      <div className="input-field col s12">
                        <i className="material-icons prefix">event</i>
                        <input type="text" id="birthDate" name="birthDate" className="datepicker validate" required />
                        <label htmlFor="birthDate">Tanggal Lahir<span className="mandatory-indicator">*</span></label>
                        <span className="helper-text" data-error="This field is required"></span>
                      </div>

                      <div className="input-field col s12">
                        <i className="material-icons prefix">person</i>
                        <div className="gender-label">Jenis Kelamin<span className="mandatory-indicator">*</span></div>
                        <div className="radio-container">
                          <label>
                            <input name="gender" type="radio" value="Laki-laki" required />
                            <span>Laki-laki</span>
                          </label>
                        </div>
                        <div className="radio-container">
                          <label>
                            <input name="gender" type="radio" value="Perempuan" />
                            <span>Perempuan</span>
                          </label>
                        </div>
                      </div>

                      <div className="input-field col s12">
                        <i className="material-icons prefix">opacity</i>
                        <input type="text" id="bloodType" name="bloodType" className="validate" />
                        <label htmlFor="bloodType">Golongan Darah</label>
                        <span className="helper-text" data-error="Hanya boleh diisi dengan A, B, AB, O, atau dikosongkan"></span>
                      </div>

                      {/* Address Section */}
                      <div className="col s12">
                        <h6 className="section-title teal-text">Address Information</h6>
                        <div className="divider"></div>
                        <p className="mandatory-note"><span className="mandatory-indicator">*</span> Menandakan kolom yang wajib diisi</p>
                      </div>

                      <div className="input-field col s12">
                        <i className="material-icons prefix">home</i>
                        <textarea id="address" name="address" required></textarea>
                        <label htmlFor="address">Alamat tempat tinggal sekarang<span className="mandatory-indicator">*</span></label>
                        <span className="helper-text" data-error="This field is required"></span>
                      </div>

                      <div className="input-field col s12">
                        <i className="material-icons prefix">home</i>
                        <textarea id="rtrw" name="rtrw"></textarea>
                        <label htmlFor="rtrw">RT/RW</label>
                      </div>

                      <div className="input-field col s12">
                        <i className="material-icons prefix">location_on</i>
                        <select id="provinceDropdown" name="province" required defaultValue="">
                          <option value="" disabled>Pilih Provinsi</option>
                        </select>
                        <label>Provinsi<span className="mandatory-indicator">*</span></label>
                      </div>

                      <div className="input-field col s12">
                        <i className="material-icons prefix">location_city</i>
                        <select id="cityDropdown" name="city" required disabled defaultValue="">
                          <option value="" disabled>Pilih Kota/Kabupaten</option>
                        </select>
                        <label>Kota/Kabupaten<span className="mandatory-indicator">*</span></label>
                      </div>

                      <div className="input-field col s12">
                        <i className="material-icons prefix">place</i>
                        <select id="districtDropdown" name="district" required disabled defaultValue="">
                          <option value="" disabled>Pilih Kecamatan</option>
                        </select>
                        <label>Kecamatan<span className="mandatory-indicator">*</span></label>
                      </div>

                      <div className="input-field col s12">
                        <i className="material-icons prefix">apartment</i>
                        <select id="subDistrictDropdown" name="subDistrict" required disabled defaultValue="">
                          <option value="" disabled>Pilih Kelurahan</option>
                        </select>
                        <label>Kelurahan<span className="mandatory-indicator">*</span></label>
                      </div>

                      <div className="input-field col s12">
                        <i className="material-icons prefix">markunread_mailbox</i>
                        <input type="text" id="postalCode" name="postalCode" readOnly />
                        <label htmlFor="postalCode">Kode Pos<span className="mandatory-indicator">*</span></label>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="card-action center-align">
                  <button type="button" id="submitButton" className="btn-large waves-effect waves-light teal">
                    Submit
                    <i className="material-icons right">send</i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="page-footer teal">
        <div className="footer-copyright">
          <div className="container center-align">
            2025 Data Form
          </div>
        </div>
      </footer>

      {/* Material Design JavaScript */}
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js" strategy="beforeInteractive" />
      <Script src="/location-data.js" strategy="beforeInteractive" />
      <Script src="/cascading-dropdowns.js" strategy="afterInteractive" />
      <Script src="/script.js" strategy="afterInteractive" />
    </div>
  );
}
