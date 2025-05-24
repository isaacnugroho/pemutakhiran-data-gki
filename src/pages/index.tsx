import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { initializeForm, validateFormData, handleFormSubmit } from '../utils/formUtils';
import packageInfo from '../../package.json';

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
        <title>Form Data Diri</title>
        <meta name="description" content="Penunjang Form Pemutakhiran Data Jemaat GKI Kebayoran Baru" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="row">
          <div className="col s12">
            <div className="card">
              <div className="card-content">

                <div className="card-title" style={{ display: 'flex', alignItems: 'center' }}>
                  <img 
                    src="/assets/logo.jpg" 
                    alt="Logo" 
                    style={{ height: '96px', marginRight: '10px' }} 
                  />
                  <span>Penunjang Form Pemutakhiran Data Jemaat GKI Kebayoran Baru</span>
                </div>
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
                        <h5>Data Diri</h5>
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
                        <label id="bloodType-label" htmlFor="bloodType" className="active">Golongan Darah*</label>
                        <div className="radio-container">
                          <p>
                            <label>
                              <input id="bloodType-a" name="bloodType" type="radio" value="A" />
                              <span>A</span>
                            </label>
                          </p>
                          <p>
                            <label>
                              <input id="bloodType-b" name="bloodType" type="radio" value="B" />
                              <span>B</span>
                            </label>
                          </p>
                          <p>
                            <label>
                              <input id="bloodType-o" name="bloodType" type="radio" value="O" />
                              <span>O</span>
                            </label>
                          </p>
                          <p>
                            <label>
                              <input id="bloodType-ab" name="bloodType" type="radio" value="AB" />
                              <span>AB</span>
                            </label>
                          </p>
                        </div>
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
                        <span className="helper-text2">Harap isi alamat dengan dimulai dari nama perumahan/komplek</span>
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
                                if (validateFormData()) {
                                  if (typeof window !== 'undefined') {
                                    const url = handleFormSubmit();
                                    window.open(url, '_blank');
                                  }
                                }
                              }
                            }
                          >
                          Lanjut ke Google Form Pemutakhiran Data Jemaat GKI Kebayoran Baru
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
            &copy;2025 Form Pemutakhiran Data Jemaat GKI Kebayoran Baru
            <div className="version">v{packageInfo.version}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

