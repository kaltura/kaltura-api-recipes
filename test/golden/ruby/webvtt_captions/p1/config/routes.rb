Rails.application.routes.draw do
  get 'index' => 'main#index'
  get 'KalturaCaptionAssetListResponse' => 'main#KalturaCaptionAssetListResponse'
  get 'KalturaCaptionAsset' => 'main#KalturaCaptionAsset'
  post 'listCaptionAsset' => 'main#listCaptionAsset'
  post 'getCaptionAsset' => 'main#getCaptionAsset'
  root 'main#index'
end
