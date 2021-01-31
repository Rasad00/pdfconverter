import React from 'react';
import { Uploader } from 'components';
import SharedFilesProvier from "contexts/SharedFiles";

const App: React.FC = () => (
  <SharedFilesProvier>
    <main>
      <section className="converter">
        <div className="uploader">
          <Uploader />
        </div>
      </section>
    </main>
    <div className="circle1"></div>
    <div className="circle2"></div>
    <div className="poweredby">powered by Nazarzade</div>
  </SharedFilesProvier>
);


export default App;
