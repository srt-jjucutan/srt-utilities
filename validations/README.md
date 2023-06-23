## Callback auto validator

### Pre-requisites

Include this script to the EditProfile or Provider page; make sure that it is last to be loaded

```
    <script src="<$link;/Onboarding/UnplacedPages/js/validation-callback-handler.js>" defer></script>
```

Make sure that prompts is in `span` and isolated in any container like `td` or `div`

```
    <td>
        <span id="First_Name_prompt">First Name</span>
    </td>
```

Fields name with datepicker should be appended with `_display` when declared in scripts

Add `.required-indicator { color: red; }` in styles.

#### How to require fields?

Add `REQUIRED_FIELDS` array variable to EditProfile page like so:

```
    var REQUIRED_FIELDS = [
        'First_Name',
        'Last_Name',
    ];
```


#### How to require group of fields that depends on each other 
Create an array `REQUIRED_FIELD_GROUPS` and add all the fields that will become required if any of the group have value

```
    var REQUIRED_FIELD_GROUPS = [
        [ 'field1', 'field2' ], // a group of fields
        [ 'field2', 'field3', 'DOB_display' ],  // another group of fields
    ]
```
    

#### How to require fields that depends on other fields?
1. Create `REQUIRE_FIELD_DEPENDS` array of objects with elements `controls` and `dependents`
2. `controls` will determine if `dependents` are required like so:

```
    var REQUIRE_FIELD_DEPENDS = [
        {
            controls: [ 'field1', 'field2' ], 
            dependents: [ 'optional_field1', 'optional_field2' ]
        },
    ];
```

Example code on Apple Staging: /Onboarding/UnplacedPages/WD_AUS_Provider_EditProfile.html