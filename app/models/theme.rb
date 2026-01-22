# frozen_string_literal: true

# Model for Theme
# rubocop:disable Naming/VariableNumber
class Theme < ApplicationRecord
  DEFAULT_THEME = {
    site_title: 'Primero',
    kiosk_name: 'Primero',
    site_description: { en: I18n.t('email.site_description', locale: :en) },
    revision: SecureRandom.uuid
  }.with_indifferent_access.freeze

  PICTORIAL_SIZES = %w[144 192 256].freeze

  attr_accessor :bypass_logos

  store_accessor :data, :site_description, :site_title,
                 :revision, :kiosk_name

  has_one_attached :logo
  has_one_attached :logo_pictorial
  has_one_attached :logo_pictorial_144
  has_one_attached :logo_pictorial_192
  has_one_attached :logo_pictorial_256
  has_one_attached :favicon

  validates :logo, presence: true, unless: :bypass_logos
  validates :logo_pictorial, presence: true, unless: :bypass_logos
  validates :logo_pictorial_144, presence: true, unless: :bypass_logos
  validates :logo_pictorial_192, presence: true, unless: :bypass_logos
  validates :logo_pictorial_256, presence: true, unless: :bypass_logos
  validates :favicon, presence: true, unless: :bypass_logos
  # rubocop:enable Naming/VariableNumber

  before_save :generate_new_revision

  def generate_new_revision
    self.revision = SecureRandom.uuid
  end

  def t(key, locale)
    data.dig(key, locale) || data.dig(key, I18n.default_locale.to_s) ||
      DEFAULT_THEME.dig(key, 'en') || ''
  end

  def get(key, default_value = '')
    data[key] || default_value
  end

  class << self
    def current
      @current ||=
        where(disabled: false).order(created_at: :desc).first ||
        new(DEFAULT_THEME)
    end

    def create_or_update!(hash = {})
      theme = current || new(DEFAULT_THEME)
      theme.assign_attributes(hash)
      theme.save!
      theme
    end
  end
end
