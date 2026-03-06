# frozen_string_literal: true

# Define an application-wide content security policy
# For further information see the following documentation
# https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy

return if ActiveRecord::Type::Boolean.new.cast(ENV.fetch('SKIP_CSP', nil)) || false

self_sources = %i[self https]

self_sources += %i[http] + %w[localhost:5100 localhost:5173 localhost:3036] if Rails.env.development?

storage_sources =
  case ENV.fetch('PRIMERO_STORAGE_TYPE', nil)
  when 'microsoft'
    self_sources + ["https://#{ENV.fetch('PRIMERO_STORAGE_AZ_ACCOUNT', nil)}.blob.core.windows.net"]
  else
    self_sources
  end

media_sources = storage_sources + %i[data blob]
font_and_image_sources = self_sources + %i[data blob]
style_sources = self_sources
script_sources = self_sources + %i[data blob]
connect_sources = font_and_image_sources

style_sources += ["'unsafe-inline'"] if Rails.env.development?
script_sources += ["'unsafe-inline'"] if Rails.env.development?
connect_sources += %i[ws wss data blob] if Rails.env.development?

Rails.application.config.content_security_policy do |policy|
  policy.default_src(*self_sources)
  policy.connect_src(*connect_sources)
  policy.font_src(*font_and_image_sources)
  policy.img_src(*font_and_image_sources)
  policy.media_src(*media_sources)
  policy.script_src(*script_sources)
  policy.style_src(*style_sources)
  policy.base_uri(:self)
end

# If you are using UJS then enable automatic nonce generation
Rails.application.config.content_security_policy_nonce_generator = ->(_request) { SecureRandom.base64(16) }
Rails.application.config.content_security_policy_nonce_directives =
  Rails.env.development? ? [] : %w[style-src script-src]

# Report CSP violations to a specified URI
# For further information see the following documentation:
# https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy-Report-Only
Rails.application.config.content_security_policy_report_only = false
