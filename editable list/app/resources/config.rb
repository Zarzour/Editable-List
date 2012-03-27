dir = File.dirname(__FILE__)

load File.join('..',"lib","resources","themes")

sass_path = dir
css_path  = File.join("css")
images_dir = File.join("img")



output_style = :expanded
environment = :development