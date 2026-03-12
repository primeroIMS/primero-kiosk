# frozen_string_literal: true

require 'rails_helper'

describe 'Lock down unused ActiveStorage routes', type: :request do
  let!(:logo) do
    file_path = Rails.root.join('spec', 'resources', 'pictorial-test.png')
    fixture_file_upload(file_path, 'image/png')
  end

  let!(:app_flow) do
    app_flow = AppFlow.create!
    app_flow.logo_pictorial.attach(logo)
    app_flow.save! && app_flow
  end

  after(:each) do
    AppFlow.destroy_all
  end

  it 'Permits GET /rails/active_storage/blobs/redirect/*' do
    path = rails_blob_path(app_flow.logo_pictorial, only_path: true)
    get path

    expect(response).to have_http_status(302)
  end

  it 'Forbids GET /rails/active_storage/proxy/redirect/*' do
    path = rails_storage_proxy_path(app_flow.logo_pictorial, only_path: true)
    get path

    expect(response).to have_http_status(403)
  end

  it 'Forbids GET /rails/active_storage/representations/*' do
    path = url_for(app_flow.logo_pictorial.variant(colourspace: 'b-w'))
    get path

    expect(response).to have_http_status(403)
  end

  it 'Forbids all POST requests /rails/active_storage/direct_uploads*' do
    params = {
      blob: {
        filename: 'pictorial-test.png', content_type: 'image/png',
        byte_size: 8978, checksum: 'wadGcJvBy0MjoCVZsn0kvA=='
      }
    }
    post(rails_direct_uploads_url, params:)

    expect(response).to have_http_status(403)
  end
end
