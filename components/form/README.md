# File Structure

📁 form/
  📁 inputs/
    └─ FormInput.vue            # Base text input
    └─ FormTextarea.vue         # Multiline text input
    └─ FormSelect.vue           # Dropdown select
    └─ FormMultiSelect.vue      # Multiple selection
    └─ FormCheckbox.vue         # Single checkbox
    └─ FormCheckboxGroup.vue    # Group of checkboxes
    └─ FormRadioGroup.vue       # Radio button group
    └─ FormDatePicker.vue       # Date selection
    └─ FormTimePicker.vue       # Time selection
    └─ FormDateTimePicker.vue   # Combined date/time
    └─ FormFileUpload.vue       # File upload
    └─ FormSearchSelect.vue     # Searchable dropdown
    └─ FormNumberInput.vue      # Numeric input
    └─ FormColorPicker.vue      # Color selection (I don't think I'm gonna use it - and I hate that it's the american spelling but "consistency" I guess)
    
  📁 layout/
    └─ FormGroup.vue            # Input group wrapper
    └─ FormSection.vue          # Form section with title
    └─ FormRow.vue              # Horizontal layout
    └─ FormColumn.vue           # Vertical layout
    └─ FormDivider.vue          # Section separator
    
  📁 feedback/
    └─ FormLabel.vue            # Input label
    └─ FormHelp.vue             # Help text
    └─ FormError.vue            # Error message
    └─ FormValidation.vue       # Validation message
    └─ FormCounter.vue          # Character counter
    └─ FormProgress.vue         # Form completion progress
    
  📁 buttons/
    └─ FormSubmit.vue           # Submit button
    └─ FormReset.vue            # Reset button
    └─ FormCancel.vue           # Cancel button
    └─ FormButtonGroup.vue      # Button container
    
  📁 custom/
    └─ FormTrainerSelect.vue    # Trainer selection
    └─ FormModuleSelect.vue     # Module selection
    └─ FormDepartmentSelect.vue # Department selection
    └─ FormCategorySelect.vue   # Category selection
    └─ FormUserSelect.vue       # User selection
    └─ FormDateRangePicker.vue  # Date range selection
    └─ FormRequirements.vue     # Module requirements
    └─ FormCapacity.vue         # Session capacity
    
  📁 templates/
    └─ BaseForm.vue             # Base form wrapper
    └─ SearchForm.vue           # Search form template
    └─ FilterForm.vue           # Filter form template
    └─ WizardForm.vue           # Multi-step form