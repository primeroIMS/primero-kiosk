# frozen_string_literal: true

class CreateLookups < ActiveRecord::Migration[8.1]
  def change
    create_table :lookups do |t|
      t.string :name

      t.timestamps
    end
  end
end
