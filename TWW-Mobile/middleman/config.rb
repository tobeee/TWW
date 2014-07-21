###
# Compass
###

require 'animation'

# Change Compass configuration
compass_config do |config|
  config.output_style = :compact
  #config.relative_assets = true
  #config.preferred_syntax = :sass
end

###
# Page options, layouts, aliases and proxies
###

page 'index.html', layout: false

###
# Helpers
###

# Automatic image dimensions on image_tag helper
# activate :automatic_image_sizes

# Reload the browser automatically whenever files change
activate :livereload

helpers do
  def jst_script_tags
    content_tag(:script) do
      ''.html_safe.tap do |r|
        r << "window.#{jst_container} || (#{jst_container} = {});"
        base = File.join(root, source, jst_dir)
        Dir.glob(File.join(base, "**/*.haml")) do |t|
          template_name = File.join(File.dirname(t).sub(base, ''), File.basename(t, ".haml").gsub(/\A_/, '')).sub(/\A\//, '')
          r << "#{jst_container}['#{template_name}'] = _.template(#{partial("jst/#{template_name}").chomp.to_json});\n".html_safe
        end
      end
    end
  end

  #def map_tiles
  #  Dir["#{root}/source/images/tiles/*.png"].map do |f|
  #    File.basename(f, ".png")
  #  end.sort
  #end
end

# Compile to Trigger.IO's src directory
set :build_dir, '../src'

set :css_dir,    'css'
set :js_dir,     'js'
set :jst_dir,    'jst'
set :images_dir, 'images'

set :jst_container, 'JST'

%w(
  vendor/js
  shared/js
  shared/vendor/js
  shared/css
).map do |path|
  sprockets.append_path File.join(root, path)
end

#set :sass_assets_paths, %w(shared/css).map {|p| File.join(root, p) }

configure :development do
  # Don't concatenate assets during development
  set :debug_assets, true
end

# Build-specific configuration
configure :build do
  # For example, change the Compass output style for deployment
  # activate :minify_css

  # Minify Javascript on build
  # activate :minify_javascript

  # Enable cache buster
  # activate :asset_hash

  # Use relative URLs
  activate :relative_assets

  # Or use a different image path
  # set :http_path, "/Content/images/"
end
