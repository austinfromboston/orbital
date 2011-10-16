class Bid < ActiveRecord::Base
  belongs_to :bidder, :validate => true, :class_name => 'Person'
  has_many :offers
  validates_presence_of :bidder_id
  attr_accessible :expires_at, :zip, :skills, :project_description, :availability, :bidder_attributes, :latitude, :longitude
  validates_length_of :skills, :project_description, :availability, :maximum => 250

  accepts_nested_attributes_for :bidder

  before_validation :set_default_expiration, :on => :create
  has_many :abuse_reports
  geocoded_by :zip
  scope :open, where("bids.expires_at > ?", Time.now)
  scope :enabled, where("bids.disabled is ? or bids.disabled = ?", nil, false)
  scope :visible, open.enabled

  def set_default_expiration
    self.expires_at ||= 1.day.from_now
  end

  def to_mappable_json
    { :id =>id, :point => { :lat => latitude, :lng => longitude }}.to_json
  end
end
