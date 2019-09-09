import React from 'react';

import * as firebase from 'firebase';
import './app.scss';
import {ProductModel} from './models/product.model';
import {ImageModel} from './models/open-graph.model';


interface AppProps {

};


interface AppState {
  products: ProductModel[];
  user: any;
  displayName: string;
  newProductUrl?: string;
}

export class App extends React.Component<AppProps, AppState> {
  private newProductUrlInput: React.RefObject<any>;

  constructor(props) {
    super(props);
    this.state = {products: [], user: null, displayName: null};
    this.newProductUrlInput = React.createRef();
    this.loginWithGoogle = this.loginWithGoogle.bind(this);
    this.addProduct = this.addProduct.bind(this);

  }

  componentDidMount(): void {
    const {user} = this.state;
    if (user) {
      this.watchProducts();
    } else {
      firebase.auth().onAuthStateChanged((user: firebase.User) => {
        const {providerData} = user;

        this.setState({user: user, displayName: providerData[0].displayName});
        this.watchProducts();

      });
    }
  }

  watchProducts() {
    firebase.firestore().collection('products').onSnapshot((querySnapshot) => {
      this.setState({
        products: querySnapshot.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data()
          }
        })
      });
    });
  }

  loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');

    firebase.auth().signInWithPopup(provider).then(userCredentials => {
      const {user} = userCredentials;
      const {providerData} = user;

      this.setState({user: user, displayName: providerData[0].displayName});
      this.watchProducts();
    });
  }

  addProduct(event) {
    const newProductUrl = this.newProductUrlInput.current.value;
    event.preventDefault();

    firebase.firestore().collection('products').add({
      url: newProductUrl
    }).then(() => {
      this.setState({newProductUrl});
    });
  }

  static deleteProduct(id) {
    firebase.firestore().collection('products').doc(id).delete().then(() => {
    });
  }


  static getImageUrl(image: ImageModel | ImageModel[]) {
    if (image instanceof Array) {
      return image[0].url;
    } else {
      return image.url;
    }
  }

  render(): React.ReactNode {
    const {user, products, displayName} = this.state;

    return (
      <div className={'container mt-xl'}>
        {user ?
          <div>
            <h1>Hello {displayName}!</h1>
            <div>
              <h2 className={'my-lg'}>Adauga produs</h2>

              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon1">URL</span>
                </div>
                <input type="text" className="form-control" aria-label="URL"
                       aria-describedby="basic-addon1" ref={this.newProductUrlInput}/>
              </div>


              <button className={'btn btn-primary'} onClick={this.addProduct}>Adauga Produs</button>
            </div>

            <div>
              <h3 className={'my-lg'}>Lista produse</h3>
              <div className={'list-group'}>
                {products.map((product, index) => {
                  return (
                    <div className={'list-group-item d-flex flex-row'} key={index}>
                      <div className={'d-flex flex-column w-100'}>
                        <div>
                          <a href={product.url} target="_blank" rel="noopener noreferrer">
                            <small>{product.url}</small>
                          </a>
                          {
                            product.metadata ?
                              <div>
                                <h4>{product.metadata.general.title}</h4>
                                <p>{product.metadata.general.description} </p>
                              </div> : null
                          }
                        </div>
                        <div className={'d-flex flex-row justify-content-end'}>
                          <button className={'btn btn-link'} onClick={() => {
                            App.deleteProduct(product.id)
                          }}>
                            <small>Sterge</small>
                          </button>
                        </div>
                      </div>

                      <div style={{width: '300px'}}>
                        {
                          product.metadata ?
                            <img className={'w-100 flex-shrink-1'}
                                 src={App.getImageUrl(product.metadata.openGraph.image)}
                                 alt={product.metadata.general.description}/>
                            :
                            <div className={'w-100 d-flex justify-content-center align-items-center'}>
                              <div className="spinner-border text-primary" role="status">
                                <span className="sr-only">Loading...</span>
                              </div>
                            </div>
                        }
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          :
          <div>
            <button className={'btn btn-primary'} onClick={this.loginWithGoogle}>Login</button>
          </div>
        }

      </div>
    );
  }
}

export default App;
