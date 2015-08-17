Rails.application.routes.draw do
  get 'index' => 'main#index'
  get 'KalturaMediaEntry' => 'main#KalturaMediaEntry'
  get 'UploadCaptions' => 'main#UploadCaptions'
  get 'CaptionUploadDone' => 'main#CaptionUploadDone'
  get 'CaptionsAttached' => 'main#CaptionsAttached'
  get 'CaptionSearch' => 'main#CaptionSearch'
  post 'getMedia' => 'main#getMedia'
  post 'searchCaptionAssetItem' => 'main#searchCaptionAssetItem'
  root 'main#index'
end
