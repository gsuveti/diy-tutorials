import React from "react";
import './tutorial.scss';
import {ConnectedSection} from '../section/section';
import {serializeAttributes} from '../utils';
import {InnerBlocksContent} from '../inner-blocks-content/inner-blocks-content';
import {Block} from '../models/block.model';
import {ConnectedProductList} from '../product-list/product-list';


/* tslint:disable:no-empty-interface */
export interface TutorialProps {
  id?: string;
  uuid?: string;
  className?: string;
  children?: any;
  innerBlocks?: Block[];
  attributes?: {
    uuid?: string;
    name?: string;
  };
  isRenderedInEditor?: boolean;
}

/* tslint:disable:no-empty-interface */
export interface TutorialState {
  displayedSections: number[];
}

const allowedComponents = {
  'irian/diy-section': ConnectedSection,
  'irian/diy-product-list': ConnectedProductList
};

export class Tutorial extends React.Component<TutorialProps, TutorialState> {
  constructor(props) {
    super(props);
    this.state = {
      displayedSections: [0]
    };
  }

  componentDidMount(): void {

    // const firebaseConfig = {
    //   apiKey: "AIzaSyD285HeMOqIYGUtbxtqReraee3wGYJDoyM",
    //   authDomain: "diy-tutorials-ro.firebaseapp.com",
    //   databaseURL: "https://diy-tutorials-ro.firebaseio.com",
    //   projectId: "diy-tutorials-ro",
    //   storageBucket: "",
    //   messagingSenderId: "755597193306",
    //   appId: "1:755597193306:web:a6746b5e60b01885"
    // };
    //
    // const app = firebase.initializeApp(firebaseConfig);
    //
    // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    //   .then(function () {
    //     firebase.auth().signInAnonymously()
    //       .catch(function (error) {
    //         console.error(error);
    //       });
    //   })
    //   .catch(function (error) {
    //     console.error(error);
    //   });
    //
    // firebase.auth().onAuthStateChanged(function (user) {
    //   if (user) {
    //     console.log(user.uid);
    //     console.log(user.isAnonymous);
    //   } else {
    //     // User is signed out.
    //   }
    // });
  }

  getSectionClassName(index: number) {
    const {displayedSections} = this.state;
    return displayedSections.indexOf(index) < 0 ? "hide" : "show";
  }

  render(): React.ReactNode {

    const {id, attributes, className, innerBlocks = [], children} = this.props;

    const content = children ?
      children
      :
      <InnerBlocksContent
        innerBlocks={innerBlocks}
        allowedComponents={allowedComponents}

      />
    ;

    return (
      <div id={id}
           className={className}
           data-attributes={serializeAttributes(attributes)}
      >
        {content}
      </div>
    );
  }
}
