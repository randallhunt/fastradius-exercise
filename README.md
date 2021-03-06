
## Fast Radius coding challenge

### Setup

You have clearly already unzipped.  Just navigate
to this director in a terminal window and run `yarn` 
to install any necessary JS modules.

## Before I continue...

Thank you for considering my application. This
was one of the most interesting coding challenges
I have been given. I really enjoyed the exercise.

# Possible commands:

### `yarn go`

Runs the example app in the development mode.<br />
This should meet the requirements of the coding
expectations.


### `yarn test`

Launches the Jest test runner, showing that I have
written several unit tests and they all pass.

### `yarn lint`

Runs ESLint against the code written in the
repo. Adhering to some minimal standards... 
given that nothing more was specified as a
requirement.

## Possible improvements

I made this as simple as the requirements specified.
It would certainly have been possible to put whiz-bang
React components all over the place, but I believe in
doing what is necessary, rather than making things
overly complex.

With that said, an obvious opportunity would be to build
out a web based UI and decorate it fancy.

Another thing that could be done, as mentioned earlier, 
would be that there is a lot more validation that could be
done on the incoming file.

It would also seem pretty obvious to make a version to parse
binary data rather than ASCII.

And in larger vision, I've only tested this against fairly
small input files, but 3D objects could be quite complex and
involve very large files, so there might be some opportunity
for chunking input and using generators to deal with data
rather than assuming it's okay to load the entire file and then
parse it all at once.

It also occurs to me that with large amounts of data, the processing
could lead to timeouts if this were a web-based interface, so there
might be some room for loading animation, progress bars, and 
keep-alive pings.

## Additional Info

There are additional files in the `data` directory,
including valid and invalid files.  If you want to run
the code against them, just invoke the javascript and
pass an argument referencing the data file.  For example:

    node ./src/parse.js ./data/valid1.stl

I hope that the code is fairly easy to follow, and I
look forward to any questions and/or discussion that 
may come out of it.  Thanks again!