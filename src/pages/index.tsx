import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { initializeForm } from '../utils/formUtils';

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark that we're on the client side
    setIsClient(true);
    
    // Initialize the form after component mounts
    initializeForm();
  }, []);

  return (
    <div className="container">
      <Head>
        <title>Form Pemutakhiran Data</title>
        <meta name="description" content="Form Pemutakhiran Data GKI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="row">
          <div className="col s12">
            <div className="card">
              <div className="card-content">
                <span className="card-title center-align">Form Pemutakhiran Data</span>
                
                {/* Loading Indicator */}
                <div id="loadingIndicator" className="center-align" style={{ marginBottom: '20px' }}>
                  <div className="preloader-wrapper small active">
                    <div className="spinner-layer spinner-blue-only">
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
                  <p id="loadingText">Loading...</p>
                </div>

                {isClient && (
                  <form id="dataForm" className="col s12">
                    {/* Personal Information Section */}
                    <div className="row">
                      <div className="col s12">
                        <h5>Informasi Pribadi</h5>
                      </div>
                    </div>

                    <div className="row">
                      <div className="input-field col s12">
                        <input id="name" type="text" className="validate" />
                        <label htmlFor="name">Nama Lengkap*</label>
                        <span className="helper-text"></span>
                      </div>
                    </div>

                    <div className="row">
                      <div className="input-field col s12">
                        <input id="phone" type="tel" className="validate" />
                        <label htmlFor="phone">Nomor Telepon*</label>
                        <span className="helper-text"></span>
                      </div>
                    </div>

                    <div className="row">
                      <div className="input-field col s12">
                        <input id="birthPlace" type="text" className="validate" />
                        <label htmlFor="birthPlace">Tempat Lahir</label>
                        <span className="helper-text"></span>
                      </div>
                    </div>

                    <div className="row">
                      <div className="input-field col s12">
                        <input id="birthDate" type="text" className="datepicker" />
                        <label htmlFor="birthDate">Tanggal Lahir*</label>
                        <span className="helper-text">Klik untuk memilih tanggal</span>
                      </div>
                    </div>

                    <div className="row">
                      <div className="input-field col s12">
                        <input id="bloodType" type="text" className="validate" />
                        <label htmlFor="bloodType">Golongan Darah</label>
                        <span className="helper-text"></span>
                      </div>
                    </div>

                    <div className="row">
                      <div className="input-field col s12">
                        <label id="gender-label" htmlFor="gender" className="active">Jenis Kelamin*</label>
                        <div className="radio-container">
                          <p>
                            <label>
                              <input id="gender-male" name="gender" type="radio" value="Laki-laki" />
                              <span>Laki-laki</span>
                            </label>
                          </p>
                          <p>
                            <label>
                              <input id="gender-female" name="gender" type="radio" value="Perempuan" />
                              <span>Perempuan</span>
                            </label>
                          </p>
                        </div>
                        <span className="helper-text"></span>
                      </div>
                    </div>

                    {/* Address Section */}
                    <div className="row">
                      <div className="col s12">
                        <h5>Alamat</h5>
                      </div>
                    </div>

                    <div className="row">
                      <div className="input-field col s12">
                        <textarea id="address" className="materialize-textarea validate"></textarea>
                        <label htmlFor="address">Alamat Lengkap*</label>
                        <span className="helper-text"></span>
                      </div>
                    </div>

                    <div className="row">
                      <div className="input-field col s12">
                        <textarea id="rtrw" className="materialize-textarea validate"></textarea>
                        <label htmlFor="rtrw">RT/RW</label>
                        <span className="helper-text"></span>
                      </div>
                    </div>

                    <div className="row">
                      <div className="input-field col s12">
                        <select id="provinceDropdown" className="browser-default" defaultValue="">
                          <option value="" disabled>Pilih Provinsi</option>
                        </select>
                        <span className="helper-text"></span>
                      </div>
                    </div>

                    <div className="row">
                      <div className="input-field col s12">
                        <select id="cityDropdown" className="browser-default" disabled defaultValue="">
                          <option value="" disabled>Pilih Kota/Kabupaten</option>
                        </select>
                        <span className="helper-text"></span>
                      </div>
                    </div>

                    <div className="row">
                      <div className="input-field col s12">
                        <select id="districtDropdown" className="browser-default" disabled defaultValue="">
                          <option value="" disabled>Pilih Kecamatan</option>
                        </select>
                        <span className="helper-text"></span>
                      </div>
                    </div>

                    <div className="row">
                      <div className="input-field col s12">
                        <select id="subDistrictDropdown" className="browser-default" disabled defaultValue="">
                          <option value="" disabled>Pilih Kelurahan</option>
                        </select>
                        <span className="helper-text"></span>
                      </div>
                    </div>

                    <div className="row">
                      <div className="input-field col s12">
                        <input id="postalCode" type="text" readOnly />
                        <label htmlFor="postalCode" className="active">Kode Pos</label>
                        <span className="helper-text"></span>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col s12 center-align">
                        <button 
                          id="submitButton" 
                          type="button" 
                          className="btn waves-effect waves-light"
                          onClick={() => {
                            console.log('Submit button clicked');
                            if (typeof window !== 'undefined') {
                              const { handleFormSubmit } = require('../utils/formUtils');
                              handleFormSubmit();
                            }
                          }}
                        >
                          Submit
                          <i className="material-icons right">send</i>
                        </button>
                        <div id="submitProgress" className="progress-indicator" style={{ display: 'none', marginTop: '10px' }}>
                          <div className="preloader-wrapper small active">
                            <div className="spinner-layer spinner-blue-only">
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
                          <p id="submitProgressText">Memproses...</p>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="page-footer">
        <div className="footer-copyright">
          <div className="container center-align">
            2023 Form Pemutakhiran Data
          </div>
        </div>
      </footer>
    </div>
  );
}
