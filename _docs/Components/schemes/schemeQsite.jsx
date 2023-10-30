import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';
import React from 'react';

export const component404 = {
  "tabs": [
    {
      "title": "Props",
      "table": {
        "data": [
          [
            'showButton',
            { type: <code>Boolean</code>, description: <>Toogle button to redirect page. Default <code>true</code>.</>},
          ],
          [
            'routeName',
            { type: <code>String</code>, description: <>Vue route name to redirect. Default <code>app.home</code>.</>},
          ],
          [
            'label',
            { type: <code>String</code>, description: <>Message to show. Default translation <CodeBlock language="js">this.$tr('ui.message.notFound')</CodeBlock></>},
          ],
          [
            'buttonLabel',
            { type: <code>String</code>, description: <>Label to button. Default translation <CodeBlock language="js">this.$tr('ui.message.goToHome')</CodeBlock></>},
          ],
        ]
      }
    }

  ]
}

export const componentAletModal = {
  "tabs": [
    {
      "title": "Params",
      "description": <><i className="colorGraySpan">Type: </i><code>Object</code><br/><i className="colorGraySpan">Description: </i><p>Configuration object for the component, including the following properties:</p></>,
      "table": {
        "data": [
          [
            'icon',
            { type: <code>String</code>, description: 'Icon class for the alert.'},
          ],
          [
            'color',
            { type: <code>String</code>, description: 'Color for the alert.'},
          ],
          [
            'title',
            { type: <code>String</code>, description: 'Title for the alert.'},
          ],
          [
            'message',
            { type: <code>String</code>, description: 'Message for the alert (loaded as HTML).'},
          ],
          [
            'actions',
            { type: <code>Array</code>, description: 'Array of action objects to display as buttons.'},
          ],
        ]
      }
    }

  ]
}

export const componentAvatarImage = {
  "tabs": [
    {
      "title": "Props",
      "table": {
        "data": [
          [
            'src',
            { type: <code>String</code>, description: 'Image URL.'},
          ],
          [
            'width',
            { type: <code>String</code>, description: 'CSS width for the preview.'},
          ],
          [
            'height',
            { type: <code>String</code>, description: 'CSS height for the preview.'},
          ],
          [
            'size',
            { type: <code>String</code>, description: 'CSS property to define both width and height for the preview.'},
          ],
          [
            'noOpen',
            { type: <code>Boolean</code>, description: 'Prevents opening the modal with the full image.'},
          ],
          [
            'noPreview',
            { type: <code>Boolean</code>, description: 'Prevents showing the preview image.'},
          ]
        ]
      }
    },
    {
      "title": "Methods",
      "table": {
        "data": [
          [
            'open(url)',
            { type: <code>Function</code>, description: 'Opens the modal with the full image from the specified URL parameter.'},
          ],
        ]
      }
    }
  ]
}

// Put examples with {}
const exampleActions = '[{ label, icon, vIf, action, route }]'
export const componentBtnMenu = {
  "tabs": [
    {
      "title": "Props",
      "table": {
        "data": [
          [
            'actions',
            { type: <code>Array</code>, description: 'Action list.', example: <CodeBlock language='js' >{exampleActions}</CodeBlock>},
          ],
          [
            'actionData',
            { type: <code>Any</code>, description: 'Data to set as parameter on callback action.'},
          ],
        ]
      }
    }
  ]
}

export const componentCalendar = {
  "tabs": [
    {
      "title": "Props",
      "table": {
        "data": [
          [
            'eventsData',
            { type: <code>Array</code>, description: <>Data for each event to load into the calendar, including preview and full data in the modal.<br /><code>[id,title,color,icon,image,date,mainDetails,extraDetails]</code></>},
          ],
          [
            'eventActions',
            { type: <code>Array</code>, description: <>Actions to load in the event modal.<br /><code>[label,icon,color,callBack]</code></>},
          ]
        ]
      }
    }
  ]
}

export const componentCaptcha = {
  "tabs": [
    {
      "title": "Props",
      "table": {
        "data": [
          [
            'checkbox',
            { type: <code>Boolean</code>, description: <>Set as <code>true</code> to load <Link to="https://developers.google.com/recaptcha/docs/display">reCAPTCHA v2</Link> or <code>false</code> to load <Link to="https://developers.google.com/recaptcha/docs/v3">reCAPTCHA v3</Link>.</>},
          ]
        ]
      }
    }
  ]
}

export const componentDynamicField = {
  "tabs": [
    {
      "title": "Props",
      "table": {
        "data": [
          [
            'field',
            { type: <code>Object</code>, description: 'Contains the configurations for each field.'},
          ],
          [
            'language',
            { type: <code>String</code>, description: <>Language text to concatenate to the end of each field label (e.g., <code>name (es)</code>).</>},
          ],
          [
            'itemId',
            { type: <code>Integer</code>, description: 'Integer ID for some fields.'},
          ],
        ]
      }
    },
    {
      "title": "Field Configuration",
      "table": {
        "data": [
          [
            'type',
            { type: <code>String</code>, description: 'Define the field type to render.'},
          ],
          [
            'value',
            { description: 'Default field data value.'},
          ],
          [
            'isTranslatable',
            { type: <code>Boolean</code>, description: 'Define if the field is translatable. (only works for rendering dynamic fields in the CRUD component)'},
          ],
          [
            'isFakeField',
            { type: <code>Boolean</code>, description: <>Return data into <code>options</code>. (only works for rendering dynamic fields in the CRUD component)</>},
          ],
          [
            'fakeFieldName',
            { type: <code>Boolean</code>, description: 'Define the name of the fake field.(only works for rendering dynamic fields in the CRUD component)'},
          ],
          [
            'noCrud',
            { type: <code>Boolean</code>, description: 'Prevent returning field data. (only works for rendering dynamic fields in the CRUD component)'},
          ],
          [
            'isFieldPassword',
            { type: <code>Boolean</code>, description: <>Add a button to toggle the input type between <code>text</code> and <code>password</code>. This attribute only applies to <code>input</code> type fields.</>},
          ],
          [
            'props',
            { type: <code>Object</code>, description: 'Props for each rendered field according to its documentation.'},
          ],
          [
            'permission',
            { type: <code>String</code>, description: 'Permission name to validate before loading the field.'},
          ],
          [
            'required',
            { type: <code>Boolean</code>, description: <>Add a rule to make the field required according to <Link to="https://quasar.dev/vue-components/input#validation">quasar-validations</Link>.</>},
          ],
          [
            'loadOptions',
            { type: <code>Object</code>, description: <>Configuration to load options from a request for select field type.<br /><Link to="/docs/VueJs/Components/dynamicField#loadoptions-params">Go to loadOptions Params</Link></>},
          ],
        ]
      }
    },
    {
      "title": "Types",
      "table": {
        "data": [
          [
            'crud',
            { description: 'Render a CRUD component as a select.'},
          ],
          [
            'input',
            { description: <>Render an input using <Link to="https://quasar.dev/vue-components/input">q-input</Link>.</>},
          ],
          [
            'search',
            { description: <>Render an input with pre-configuration to function as a search input using <Link to="https://quasar.dev/vue-components/input">q-input</Link>.</>},
          ],
          [
            'date',
            { description: <>Render an input to capture a date using the <a href="https://quasar.dev/vue-components/date">q-date</a> component.</>},
          ],
          [
            'hour',
            { description: <>Render an input to capture hour/time using the <a href="https://quasar.dev/vue-components/time">q-time</a> component.</>},
          ],
          [
            'fullDate',
            { description: 'Render an input to capture a full date.'},
          ],
          [
            'select',
            { description: <>Render a select input using <a href="https://quasar.dev/vue-components/select">q-select</a>.</>},
          ],
          [
            'treeSelect',
            { description: <>Render a tree select input using <a href="https://vue-treeselect.js.org/">vue-tree-select</a>.</>},
          ],
          [
            'html',
            { description: <>Render an HTML editor using <a href="/docs/VueJs/Components/ckEditor">ckEditor</a>.</>},
          ],
          [
            'checkbox',
            { description: <>Render a checkbox input using <a href="https://quasar.dev/vue-components/checkbox">q-checkbox</a>.</>},
          ],
          [
            'media',
            { description: 'Render a media component selector.'},
          ],
          [
            'schedule',
            { description: 'Render a schedule component.'},
          ],
          [
            'inputColor',
            { description: <>Render an input to capture a color value using the <a href="https://quasar.dev/vue-components/color-picker">q-color</a> component.</>},
          ],
          [
            'toggle',
            { description: <>Render a toggle switch using <a href="https://quasar.dev/vue-components/toggle">q-toggle</a>.</>},
          ],
          [
            'positionMarkerMap',
            { description: 'Render an openMap component to capture a position on the map.'},
          ],
          [
            'signature',
            { description: <>Render a signature pad using <a href="https://github.com/neighborhood999/vue-signature-pad">vue-signature-pad</a>.</>},
          ],
          [
            'uploader',
            { description: 'Render an uploader component.'},
          ],
          [
            'rating',
            { description: <>Render a rating input using <a href="https://quasar.dev/vue-components/rating">q-rating</a>.</>},
          ],
          [
            'selectIcon',
            { description: <>Load an input to capture an icon from the <a href="https://fontawesome.com/v5.15/icons?d=gallery&m=free">FontAwesome</a> library.</>},
          ],
          [
            'optionGroup',
            { description: <>Load a select option group using <a href="https://v1.quasar.dev/vue-components/option-group">q-option-group</a>.</>},
          ],
          [
            'captcha',
            { description: 'Load a captcha.'},
          ],
          [
            'json',
            { description: <>External component of <a href="https://vuejsexamples.com/json-editor-with-vue-js/">JSON Editor with Vue.js</a>.</>},
          ],
          [
            'media',
            { description: 'Load a media selector.', props: <Link to="/docs/VueJs/components/dynamicField#media-type-props">Enabled props for this field.</Link>},
          ]
        ]
      }
    },
    {
      "title": "Events",
      "table": {
        "data": [
          [
            'input',
            { description: 'Change field value.'},
          ]
        ]
      }
    }
  ]
}

export const dynamicFieldLoadOptionsData = [
  [
    'apiRoute',
    { type: <code>String</code>, description: 'API route to request data.'},
  ],
  [
    'requestParams',
    { type: <code>Object</code>, description: 'Standard API parameters to request data.'},
  ],
  [
    'select',
    { type: <code>Object</code>, description: 'Define how to load options from data.', params: <Link to="/docs/VueJs/components/dynamicField#loadoptions-select-params">Go to Select Params</Link>},
  ],
  [
    'filterByQuery',
    { type: <code>String</code>, description: 'Get options data from the request only for the search value.'},
  ],
]

export const dynamicFieldLoadOptionsSelectData = [
  [
    'label',
    { type: <code>String</code>, description: 'Key from data to load label option.'},
  ],
  [
    'id',
    { type: <code>String</code>, description: 'Key from data to load ID/value option.'},
  ],
]

export const dynamicFieldTypeMediaData = [
  [
    'disk',
    { description: 'Define the disk to select and upload media files.'},
  ],
  [
    'zone',
    { description: 'Zone for media file.'},
  ],
  [
    'entity',
    { description: 'Entity path to the media file.'},
  ],
  [
    'entityId',
    { description: 'Entity ID for the media file.'},
  ],
  [
    'multiple',
    { description: 'Define if it\'s a multiple selector for files. Default is to select 12 files.'},
  ],
  [
    'maxFiles',
    { description: 'Maximum number of files to select at once.'},
  ],
  [
    'directUpload',
    { description: 'Directly upload files to media when picking files to avoid using the media selector.'},
  ],
  [
    'gridColClass',
    { description: 'Define the grid column class to use for display.'},
  ],
  [
    'label',
    { description: 'Field label.'},
  ],
  [
    'accept',
    { description: 'File extensions to accept.'},
  ]
]

export const componentDynamicForm = {
  "tabs": [
    {
      "title": "Props",
      "table": {
        "data": [
          [
            'formType',
            { type: <code>String</code>, description: <>Change the stepper transition between <code>stepHorizontal</code> and <code>stepVertical</code>.</>},
          ],
          [
            'title',
            { type: <code>String</code>, description: 'Global form title.'},
          ],
          [
            'description',
            { type: <code>String</code>, description: 'Global form description.'},
          ],
          [
            'allowNavigation',
            { type: <code>Boolean</code>, description: 'Allow manual navigation between blocks.'},
          ],
          [
            'sendTo',
            { type: <code>Object</code>, description: 'Define request configuration to send form data.'},
          ],
          [
            'blocks',
            { type: <code>Array</code>, description: 'Blocks data to render the form.'},
          ],
          [
            'formId',
            { type: <code>Integer</code>, description: 'Form entity ID from the backend to get blocks from a request.'},
          ],
          [
            'actions',
            { type: <code>Object</code>, description: 'Can edit content action buttons.'},
          ],
          [
            'defaultColClass',
            { type: <code>String</code>, description: <>Change the default column class for fields (e.g., <code>col-12 col-md-6</code>).</>},
          ],
          [
            'useCaptcha',
            { type: <code>Boolean</code>, description: 'Use captcha in the last block.'},
          ],
          [
            'hideTitle',
            { type: <code>Boolean</code>, description: 'Hide the title.'},
          ],
          [
            'hideProgressBar',
            { type: <code>Boolean</code>, description: 'Hide the progress bar.'},
          ]
        ]
      }
    },
    {
      "title": "Blocks Configuration",
      "table": {
        "data": [
          [
            'title',
            { type: <code>String</code>, description: 'Block title.'},
          ],
          [
            'description',
            { type: <code>String</code>, description: 'Block description.'},
          ],
          [
            'fields',
            { type: <code>Array</code>, description: <><Link href="/docs/VueJs/Components/dynamicField">Dynamic fields</Link> to render the block.</>},
          ],
        ]
      }
    },
    {
      "title": "Actions Configuration",
      "table": {
        "data": [
          [
            'previous',
            { props: <code>label, icon, color</code>, description: 'Configuration for the previous action.'},
          ],
          [
            'next',
            { props: <code>label, icon, color</code>, description: 'Configuration for the next action.'},
          ],
          [
            'submit',
            { props: <code>label, icon, color</code>, description: 'Configuration for the submit action.'},
          ]
        ]
      }
    },
    {
      "title": "Send To Configuration",
      "table": {
        "data": [
          [
            'apiRoute',
            { type: <code>String</code>, description: 'API route to request data.'},
          ],
          [
            'extraData',
            { type: <code>Object</code>, description: 'Extra fields data to add in the request.'},
          ],
        ]
      }
    },
    {
      "title": "Events",
      "table": {
        "data": [
          [
            'input',
            { description: 'Change form values.'},
          ],
          [
            'submit',
            { description: 'Action to send form data.'},
          ],
          [
            'send',
            { description: 'Form was sent by request.'},
          ]
        ]
      }
    }
  ]
}

export const componentInnerLoading = {
  "tabs": [
    {
      "title": "Props",
      "table": {
        "data": [
          [
            'visible',
            { type: <code>Boolean</code>, description: 'Show/hide inner loading.'},
          ]
        ]
      }
    }
  ]
}

export const componentLocale = {
  "tabs": [
    {
      "title": "Props",
      "table": {
        "data": [
          [
            'value',
            { type: <code>Object</code>, description: 'Bidirectional configuration for the component.'},
          ],
          [
            'form',
            { type: <code>DOM Object</code>, description: <><a href="https://quasar.dev/vue-components/form">q-form</a> element.</>},
          ],
        ]
      }
    },
    {
      "title": "Value Configuration",
      "table": {
        "data": [
          [
            'fields',
            { type: <code>Object</code>, description: 'Define non-translatable fields with default data.'},
          ],
          [
            'fieldsTranslatable',
            { type: <code>Object</code>, description: 'Define translatable fields with default data.'},
          ],
          [
            'form',
            { type: <code>Object</code>, description: 'Form data with Laravel translations structure.'},
          ],
          [
            'formTemplate',
            { type: <code>Object</code>, description: 'Contains form data by the current language.'},
          ]
        ]
      }
    }
  ]
}

export const componentMapLeaflet = {
  "tabs": [
    {
      "title": "Props",
      "table": {
        "data": [
          [
            'height',
            { description: 'CSS height to render the map.'},
          ],
          [
            'value',
            { description: 'Value with latitude and longitude.'},
          ],
        ]
      }
    }
  ]
}

export const componentMasterExport = {
  "tabs": [
    {
      "title": "Props",
      "table": {
        "data": [
          [
            'moduleName',
            { type: <code>String</code>, description: 'Module name where to search for exportable config.'},
          ],
          [
            'fileName',
            { type: <code>String</code>, description: 'File name to export.'},
          ],
          [
            'exportName',
            { type: <code>String</code>, description: <>File name with exportable class (custom), e.g., <code>moduleName/Exportable/exportableClass</code>.</>},
          ],
          [
            'repositoryName',
            { type: <code>String</code>, description: 'Repository name to get default data to export.'},
          ],
          [
            'fields',
            { type: <code>Array</code>, description: 'Array of fields to request.'},
          ],
          [
            'headings',
            { type: <code>Array</code>, description: 'Headings to export file.'},
          ],
        ]
      }
    }
  ]
}

export const componentMasterModal = {
  "tabs": [
    {
      "title": "Props",
      "table": {
        "data": [
          [
            'color',
            { type: <code>String</code>, description: 'Color for the dialog.'},
          ],
          [
            'width',
            { type: <code>String</code>, description: 'Width for the dialog.'},
          ],
          [
            'title',
            { type: <code>String</code>, description: 'Title for the dialog.'},
          ],
          [
            'actions',
            { type: <code>Array</code>, description: 'Array of actions for the dialog.'},
          ],
          [
            'hideCloseAction',
            { type: <code>Array</code>, description: 'Hide close top action.'},
          ],
        ]
      }
    },
    {
      "title": "Actions Props",
      "description": <><i className="colorGraySpan">Type: </i><code>Object</code><br/><i className="colorGraySpan">Description: </i><p>Object containing the following properties:</p></>,
      "table": {
        "data": [
          [
            'label',
            { type: <code>String</code>, description: 'Label for the button.'},
          ],
          [
            'icon',
            { type: <code>String</code>, description: 'Icon for the button.'},
          ],
          [
            'color',
            { type: <code>String</code>, description: 'Color for the button.'},
          ],
          [
            'action',
            { type: <code>Function</code>, description: 'Action function to be executed when the button is clicked.'},
          ]
        ]
      }
    }
  ]
}

export const componentUploader = {
  "tabs": [
    {
      "title": "Props",
      "table": {
        "data": [
          [
            'accept',
            { type: <code>String</code>, description: 'String defining the accepted formats, separated by commas.'},
          ],
          [
            'maxFiles',
            { type: <code>Number</code>, description: 'Number of files to upload.'},
          ],
          [
            'emitBase64',
            { description: 'Define if files should be emitted in base64 format.'},
          ],
          [
            'emitFile',
            { description: 'Define if files should be emitted as File objects.'},
          ]
        ]
      }
    }
  ]
}