// SERVICES-46034 | Apple - Update to WD_AUS_Provider_EditProfile
// 2023-03-13 | jjucutan | created reusable validator

const popSubArray = (arr, subArr) => {
    'use strict'
    return arr.filter( ( el ) => !subArr.includes( el ) )
}

const anyHasValue = fields => {
    'use strict'
    let hasValue = false
    fields.forEach(f => {
        if (document.querySelector(`[name$="${f}"]`).value.length) {
            hasValue = true
        }
    })
    return hasValue
}

const toggleValidationIndicator = (containerGroup, enable) => {
    'use strict'
    containerGroup.forEach(containerItem => {
        const container = document.getElementById(containerItem + '_prompt')
        if (!container) {
            throw new Error(`Field ${fieldName} doesn't have a prompt.`)
        }
        const requiredIndicator = document.createElement('span')
        requiredIndicator.classList.add('required-indicator')
        requiredIndicator.innerText = ' *'
        // remove indicator if group should not be required
        if (!enable) {
            container.parentNode.querySelectorAll('.required-indicator').forEach(indicator => {
                container.parentNode.removeChild(indicator)
            })
            return
        }
        // do not add indicator if already present
        if (!container.parentNode.querySelectorAll('.required-indicator').length) {
            container.parentNode.appendChild(requiredIndicator)
        }
        return
    })
}

// disable red label color
if (ENABLE_RED_PROMPT == true || ENABLE_RED_PROMPT == false) {
    bPromptColorChangeEnabled = ENABLE_RED_PROMPT 
}
function Custom_Callback_Exec(fieldName){
    const thisField = document.querySelector(`[name$="${fieldName}"]`)
    if (!thisField) {
        throw new Error(`Trying to require ${fieldName} but it doesn't exist.`)
    }
    if(self.eFormRequiredField){
        if(eFormRequiredField(thisField.value, fieldName, fieldName)==false) {
            bRet = false
        }
        return true
    } 
    if(self.IsValidationEnabled){
        if (IsValidationEnabled()){
            var sMessage = 'Error trying to validate against function eFormRequiredField\nFunction not found for validation of'
            if (self.AddError)
                AddError(fieldName, sMessage, '')
            else
                alert(sMessage)
            bRet=false
        }
    }
    return true
}

function funcCustomOnSubmitCallback(formobject){
    REQUIRED_FIELD_GROUPS.forEach(group => {
        // clean up field groups
        REQUIRED_FIELDS = popSubArray(REQUIRED_FIELDS, group)
        // add back field groups that has value
        if (anyHasValue(group)) {
            REQUIRED_FIELDS = REQUIRED_FIELDS.concat(group)
        }
    })
    REQUIRE_FIELD_DEPENDS.forEach(group => {
        // clean up field groups
        REQUIRED_FIELDS = popSubArray(REQUIRED_FIELDS, group.dependents)
        // add back field groups that has value
        if (anyHasValue(group.controls)) {
            REQUIRED_FIELDS = REQUIRED_FIELDS.concat(group.dependents)
        }
    })
    REQUIRED_FIELDS.forEach(f => {
        Custom_Callback_Exec(f)
    })
}

document.onreadystatechange = () => {
    REQUIRED_FIELDS.forEach(f => {
        // add required indicator to each labels
        const requiredIndicator = document.createElement('span')
        requiredIndicator.classList.add('required-indicator')
        requiredIndicator.innerText = ' *'
        const promptContainer = document.getElementById(`${f}_prompt`)
        promptContainer.parentNode.insertBefore(requiredIndicator, promptContainer.nextSibling)
    })
    REQUIRED_FIELD_GROUPS.forEach(group => {
        // toggle required indicator on load
        toggleValidationIndicator(group, anyHasValue(group))
        // toggle required indicator on value change
        group.forEach(groupItem => {
            ['change', 'blur', 'keyup'].forEach(evt => {
                document.querySelector(`[name$="${groupItem}"]`).addEventListener(evt, _ => {
                    toggleValidationIndicator(group, anyHasValue(group))
                })
            })
        })
    })
    REQUIRE_FIELD_DEPENDS.forEach(depends => {
        // toggle required indicator on load
        toggleValidationIndicator(depends.dependents, anyHasValue(depends.controls))
        // toggle required indicator on value change
        depends.controls.forEach(controller => {
            ['change', 'blur', 'keyup'].forEach(evt => {
                const field = document.querySelector(`[name$="${controller}"]`)
                field.addEventListener(evt, _ => {
                    toggleValidationIndicator(depends.dependents, anyHasValue(depends.controls))
                })
                if (field.classList.contains('hasDatepicker')) {
                    jQuery(field).on('change', _ => {
                        toggleValidationIndicator(depends.dependents, anyHasValue(depends.controls))
                    })
                }
            })
        })
    })
}