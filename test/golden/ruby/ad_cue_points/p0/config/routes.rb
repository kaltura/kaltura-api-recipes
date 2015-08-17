Rails.application.routes.draw do
  get 'index' => 'main#index'
  get 'KalturaCuePointListResponse' => 'main#KalturaCuePointListResponse'
  get 'KalturaMediaEntry' => 'main#KalturaMediaEntry'
  get 'AddAdCuePointForm' => 'main#AddAdCuePointForm'
  get 'AddAdCuePoint' => 'main#AddAdCuePoint'
  get 'CuePointAdded' => 'main#CuePointAdded'
  post 'listCuePoint' => 'main#listCuePoint'
  post 'getMedia' => 'main#getMedia'
  root 'main#index'
end
