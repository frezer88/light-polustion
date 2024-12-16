import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';
import _ from 'lodash';

interface ILoading {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<ILoading>({
  isLoading: false,
  startLoading: () => {},
  stopLoading: () => {},
});

const LoadingProvider: FC<PropsWithChildren> = ({children}) => {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = () => {
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  return (
    <LoadingContext.Provider value={{isLoading, startLoading, stopLoading}}>
      {children}
    </LoadingContext.Provider>
  );
};

const useLoading = () => useContext(LoadingContext);

export {useLoading};
export default LoadingProvider;
