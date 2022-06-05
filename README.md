# insomnia-plugin-copy-path
Automatically copy response data based on its path in [Insomnia REST Client](https://insomnia.rest). Use a request header to specify the respective [XPath](https://www.w3.org/TR/xpath/) or [JSONPath](https://goessner.net/articles/JsonPath/). 

## Installation
### From Insomnia Plugin Hub
1. Navigate to [https://insomnia.rest/plugins/insomnia-plugin-copy-path](https://insomnia.rest/plugins/insomnia-plugin-copy-path)
2. Click _Install Plugin_
3. Click _Open_
4. Once opened, click _Install_

### From the Insomnia App
1. Go to _Application_ > _Preferences_ **or** click the cog icon (⚙️)
2. Navigate to the _Plugins_ tab
3. Enter `insomnia-plugin-copy-path`
4. Click _Install_

### Manual Install
1. Using a terminal, `cd` into your Insomnia plugins folder - [see Insomnia Docs](https://docs.insomnia.rest/insomnia/introduction-to-plugins)
2. Run `git clone https://github.com/okdv/insomnia-plugin-copy-path.git`
3. Run `cd insomnia-plugin-copy-path`

## Usage
To activate this plugin on a request, include a header named `copy-path` and simply set its value to the desired XPath or JSONPath. For example, `copy-path: //foo` or `copy-path: $..foo`.

### Options
There are a few options available to make the copy method more intuitive, none are required. These options can be included anywhere in the header name **after** `copy-path`. For example, `copy-path --optionA --optionB` or `copy-path--option`.

> `--option-name` - **Eligible Paths** - _Default_ : Description | Example

- `--first` - **XPath** / **JSONPath** : Return only the first match | [**{"foo":"bar"}**,"foo",["bar"]]

- `--last` - **XPath** / **JSONPath** : Return only the last match | [1,2,**3**]

- `--all` - **XPath** / **JSONPath** - _Default_ : Return only the last match | **[1,2,3]**

- `--outer` - **XPath** : Return includes XML tags | **<foo>bar</bar>**

- `--inner` - **XPath** - _Default_ : Return includes XML tags | <foo>**bar**</bar>

### Examples
> `header`
> ```xml 
> response
> ```
> *matched, **copied** value*

#### XPath
##### Default
`copy-path : //bar`
```xml
<?xml version="1.0"?>
<foo>
   <bar>Hello</bar>
   <bar>World</bar>
</foo>
```
*["**Hello**"**,** "**World**"]*

##### With Options
`copy-path --first --outer: /foo/bar`
```xml
<?xml version="1.0"?>
<foo>
   <bar>Hello</bar>
   <bar>World</bar>
</foo>
```
*["**<bar>Hello</bar>**"**,** "<bar>World</bar>"]*

#### JSONPath
##### Default
`copy-path : $.foo`
```json
{
  "foo": "Hello",
  "foobar": ["Hello","World"],
  "bar": {
    "foo": "World",
  }
}
```
*["**Hello**"]*

##### With Options
`copy-path--last : $..foo`
```json
{
  "foo": "Hello",
  "foobar": ["Hello","World"],
  "bar": {
    "foo": "World",
  }
}
```
*["Hello","**World**"]*

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)