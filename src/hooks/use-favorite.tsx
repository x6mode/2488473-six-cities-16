import { toggleFavorites } from '../store/rootAction';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/index';
import { useNavigate } from 'react-router-dom';

import { TOffer, TOfferDetail } from '../types/global';
import { toast } from 'react-toastify';
import { getToken } from '../service/token';


type TFavoriteProp = TOffer | TOfferDetail | undefined;

function useFavorite (offer: TFavoriteProp) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const previewImage = useAppSelector((state) => state.offers.find((item) => item.id === offer?.id)?.previewImage);

  const isAuth = useAppSelector((state) => state.authorization);
  const isFavorite = useAppSelector((state) => state
    .favorites
    .filter((item) => item.id === offer?.id).length > 0
  );

  const [isToggle, setToggle] = useState<boolean>(isFavorite);
  const [isDisabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    setToggle(isFavorite);
  }, [isFavorite]);

  function setFavorite () {
    dispatch(toggleFavorites({
      id: offer?.id,
      title: offer?.title,
      type: offer?.type,
      price: offer?.price,
      previewImage,
      city: offer?.city,
      location: offer?.location,
      isFavorite: offer?.isFavorite,
      isPremium: offer?.isPremium,
      rating: offer?.rating
    }));
    setToggle((prev) => !prev);
  }

  function handleButtonClick (): void {
    if (isAuth instanceof Object) {
      setDisabled(true);
      fetch(`https://16.design.htmlacademy.pro/six-cities/favorite/${offer?.id}/${+(!isToggle)}`, {method: 'POST', headers: {'X-Token': getToken()}})
        .then((data) => ![200, 201, 204].includes(data.status) ? toast('Не удалось произвести операцию над букмарком!', {type: 'error'}) : setFavorite())
        .catch(() => toast('Не удалось произвести операцию над букмарком!', {type: 'error'}));
      setDisabled(false);
      return;
    }
    navigate('/login');
  }

  return [isToggle, isDisabled, handleButtonClick];
}

export default useFavorite;