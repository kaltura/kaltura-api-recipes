Rails.application.routes.draw do
  get 'index' => 'main#index'
  get 'CodeCuePointListResponse' => 'main#CodeCuePointListResponse'
  get 'KalturaMediaEntry' => 'main#KalturaMediaEntry'
  get 'AddCodeCuePointForm' => 'main#AddCodeCuePointForm'
  get 'AddCodeCuePoint' => 'main#AddCodeCuePoint'
  get 'CodeCuePointAdded' => 'main#CodeCuePointAdded'
  post 'listCuePoint' => 'main#listCuePoint'
  post 'getMedia' => 'main#getMedia'
  root 'main#index'
end
