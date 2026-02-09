# frozen_string_literal: true

# Model for Theme
# rubocop:disable Naming/VariableNumber
class Theme < ApplicationRecord
  DEFAULT_THEME = {
    site_title: 'Primero Kiosk',
    kiosk_name: 'Primero Kiosk',
    site_description: { en: I18n.t('site_description', locale: :en) },
    revision: SecureRandom.uuid
  }.with_indifferent_access.freeze

  PICTORIAL_SIZES = %w[144 192 256 512].freeze

  attr_accessor :bypass_logos

  store_accessor :data, :site_description, :site_title,
                 :revision, :kiosk_name, :colors, :copy

  has_one_attached :logo
  has_one_attached :logo_pictorial
  has_one_attached :logo_pictorial_secondary
  has_one_attached :logo_pictorial_144
  has_one_attached :logo_pictorial_192
  has_one_attached :logo_pictorial_256
  has_one_attached :logo_pictorial_512
  has_one_attached :favicon

  validate :valid_html_colors
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

  def valid_html_colors
    return unless colors.present?

    invalid_color_keys = []
    colors.each { |key, color| invalid_color_keys << key unless color.match(/#\h{6}/) }

    return unless invalid_color_keys.present?

    errors.add(:colors, "must be a valid hexadecimal color (#{invalid_color_keys.join(',')})")
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
