# frozen_string_literal: true

class CreateLookupOptions < ActiveRecord::Migration[8.1]
  def change
    create_table :lookup_options do |t|
      t.belongs_to :lookup, null: false, foreign_key: true
      t.jsonb :data, default: {}

      t.timestamps
    end
  end
end
