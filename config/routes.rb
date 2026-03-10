# frozen_string_literal: true

Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get 'up' => 'rails/health#show', as: :rails_health_check
  resources :health, only: %i[index show]

  get '/dev-sw.js', to: 'service_worker#show'
  get '/sw.js', to: 'service_worker#show'
  get 'manifest', to: 'service_worker#manifest', defaults: { format: :json }

  root 'home#index'

  namespace :api, defaults: { format: :json } do
    get :theme, to: 'themes#index'
    resources :system_settings, only: [:index]
    resources :lookups, only: [:index]
    resources :app_flows, only: [:index]
    post :records, to: 'records#create'
  end

  # TanStack Router SPA - catch all other routes (except ActiveStorage which is auto-mounted)
  get '*all', to: 'home#index', constraints: lambda { |req|
    req.format.html? && !req.path.start_with?(ActiveStorage.routes_prefix)
  }

  # Lock down Active Storage routes
  scope ActiveStorage.routes_prefix do
    get '/blobs/proxy/:signed_id/*filename', to: 'forbidden#forbid!'
    get '/representations/redirect/:signed_blob_id/:variation_key/*filename', to: 'forbidden#forbid!'
    get '/representations/proxy/:signed_blob_id/:variation_key/*filename', to: 'forbidden#forbid!'
    get '/representations/:signed_blob_id/:variation_key/*filename', to: 'forbidden#forbid!'
    put  '/disk/:encoded_token', to: 'forbidden#forbid!'
    post '/direct_uploads', to: 'forbidden#forbid!'
  end
end
