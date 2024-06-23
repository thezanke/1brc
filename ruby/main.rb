require 'bigdecimal'

file_name_from_command_line = ARGV[0]

if file_name_from_command_line.nil?
  puts 'Please provide a file name'
  exit
end

map = {}

File.open(file_name_from_command_line, 'r').each_line do |line|
  # Split the line by semi-colon
  name, tempstr = line.split(';')

  # convert the string to decimal
  temp = tempstr.to_f

  # Check if the name is already in the map
  if map.key?(name)
    # If it is, add the temperature to the existing value
    map[name][:count] += 1
    map[name][:total] += temp
    if temp < map[name][:min]
      map[name][:min] = temp
    elsif temp > map[name][:max]
      map[name][:max] = temp
    end
  else
    # Add the name and temperature to the map
    map[name] = {
      count: 1,
      total: temp,
      min: temp,
      max: temp
    }
  end
end
