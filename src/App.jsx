import ComparisonSlider from './ComprisonSlider';
import { topImage, bottomImage } from './images';

function App() {
  return (
    <div className="App">
      <ComparisonSlider topImage={topImage} bottomImage={bottomImage} />
    </div>
  );
}

export default App;
