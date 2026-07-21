# frozen_string_literal: true

# Controller for handling service worker
class ServiceWorkerController < ApplicationController
  def show
    if Rails.env.development?
      vite_dev_server = "http://localhost:#{vite_port}"
      response = Net::HTTP.get_response(URI("#{vite_dev_server}/vite-dev/dev-sw.js?dev-sw"))
      render body: response.body, content_type: 'application/javascript'
    else
      render file: Rails.root.join('public', 'sw.js'), content_type: 'application/javascript'
    end
  end

  def manifest
    @theme = Theme.current
    render 'service_worker/manifest', formats: :json
  end

  private

  def vite_port
    vite_config = Rails.root.join('config', 'vite.json')
    JSON.parse(File.read(vite_config)).dig('development', 'port') || 3036
  end
end
