/*!
 * FormValidation (http://formvalidation.io)
 * The best jQuery plugin to validate form fields. Support Bootstrap, Foundation, Pure, SemanticUI, UIKit and custom frameworks
 *
 * @version     v0.6.2-dev, built on 2026-06-12 1:42:44 PM
 * @author      https://twitter.com/nghuuphuoc
 * @copyright   (c) 2013 - 2015 Nguyen Huu Phuoc
 * @license     http://formvalidation.io/license/
 */
/**
 * This class supports validating Bootstrap form (http://getbootstrap.com/)
 */
(function($) {
    FormValidation.Framework.Bootstrap = function(element, options, namespace) {
        options = $.extend(true, {
            button: {
                selector: '[type="submit"]',
                // The class of disabled button
                // http://getbootstrap.com/css/#buttons-disabled
                disabled: 'disabled'
            },
            control: {
                valid:   'is-valid',
                invalid: 'is-invalid'
            },
            err: {
                // http://getbootstrap.com/docs/5.0/forms/validation/
                clazz:  'invalid-feedback',
                parent: '^(.*)col-(sm|md|lg|xl|xxl)-(offset-){0,1}[0-9]+(.*)$'
            },
            icon: {
                valid: null,
                invalid: null,
                validating: null,
                feedback: 'form-control-feedback'
            },
            row: {
                // .form-group is unstyled in BS5 but kept as the library's row anchor.
                // Portal app wrappers should use class="mb-3 form-group".
                selector: '.form-group',
                valid:    '',
                invalid:  '',
                feedback: ''
            }
        }, options);

        FormValidation.Base.apply(this, [element, options, namespace]);
    };

    FormValidation.Framework.Bootstrap.prototype = $.extend({}, FormValidation.Base.prototype, {
        /**
         * Specific framework might need to adjust the icon position
         *
         * @param {jQuery} $field The field element
         * @param {jQuery} $icon The icon element
         */
        _fixIcon: function($field, $icon) {
            var ns      = this._namespace,
                type    = $field.attr('type'),
                field   = $field.attr('data-' + ns + '-field'),
                row     = this.options.fields[field].row || this.options.row.selector,
                $parent = $field.closest(row);

            // Place it after the container of checkbox/radio
            // so when clicking the icon, it doesn't effect to the checkbox/radio element
            if ('checkbox' === type || 'radio' === type) {
                var $fieldParent = $field.parent();
                if ($fieldParent.hasClass('form-check')) {
                    $icon.insertAfter($fieldParent);
                } else if ($fieldParent.parent().hasClass('form-check')) {
                    $icon.insertAfter($fieldParent.parent());
                }
            }

            // The feedback icon does not render correctly if there is no label
            // https://github.com/twbs/bootstrap/issues/12873
            if ($parent.find('label').length === 0) {
                $icon.addClass('fv-icon-no-label');
            }
            // Fix feedback icons in input-group
            if ($parent.find('.input-group').length !== 0) {
                $icon.addClass('fv-bootstrap-icon-input-group')
                     .insertAfter($parent.find('.input-group').eq(0));
            }
        },

        /**
         * Create a tooltip or popover
         * It will be shown when focusing on the field
         *
         * @param {jQuery} $field The field element
         * @param {String} message The message
         * @param {String} type Can be 'tooltip' or 'popover'
         */
        _createTooltip: function($field, message, type) {
            var ns    = this._namespace,
                $icon = $field.data(ns + '.icon');
            if ($icon) {
                var el = $icon[0],
                    instance;
                $icon.css({ 'cursor': 'pointer', 'pointer-events': 'auto' });
                switch (type) {
                    case 'popover':
                        instance = bootstrap.Popover.getInstance(el);
                        if (instance) { instance.dispose(); }
                        new bootstrap.Popover(el, {
                            container: 'body',
                            content: message,
                            html: true,
                            placement: 'top',
                            trigger: 'hover click'
                        });
                        break;

                    case 'tooltip':
                    /* falls through */
                    default:
                        instance = bootstrap.Tooltip.getInstance(el);
                        if (instance) { instance.dispose(); }
                        new bootstrap.Tooltip(el, {
                            container: 'body',
                            html: true,
                            placement: 'top',
                            title: message
                        });
                        break;
                }
            }
        },

        /**
         * Destroy the tooltip or popover
         *
         * @param {jQuery} $field The field element
         * @param {String} type Can be 'tooltip' or 'popover'
         */
        _destroyTooltip: function($field, type) {
            var ns    = this._namespace,
                $icon = $field.data(ns + '.icon');
            if ($icon) {
                var el = $icon[0],
                    instance;
                $icon.css({ 'cursor': '', 'pointer-events': 'none' });
                switch (type) {
                    case 'popover':
                        instance = bootstrap.Popover.getInstance(el);
                        if (instance) { instance.dispose(); }
                        break;

                    case 'tooltip':
                    /* falls through */
                    default:
                        instance = bootstrap.Tooltip.getInstance(el);
                        if (instance) { instance.dispose(); }
                        break;
                }
            }
        },

        /**
         * Hide a tooltip or popover
         *
         * @param {jQuery} $field The field element
         * @param {String} type Can be 'tooltip' or 'popover'
         */
        _hideTooltip: function($field, type) {
            var ns    = this._namespace,
                $icon = $field.data(ns + '.icon');
            if ($icon) {
                var el = $icon[0],
                    instance;
                switch (type) {
                    case 'popover':
                        instance = bootstrap.Popover.getInstance(el);
                        if (instance) { instance.hide(); }
                        break;

                    case 'tooltip':
                    /* falls through */
                    default:
                        instance = bootstrap.Tooltip.getInstance(el);
                        if (instance) { instance.hide(); }
                        break;
                }
            }
        },

        /**
         * Show a tooltip or popover
         *
         * @param {jQuery} $field The field element
         * @param {String} type Can be 'tooltip' or 'popover'
         */
        _showTooltip: function($field, type) {
            var ns    = this._namespace,
                $icon = $field.data(ns + '.icon');
            if ($icon) {
                var el = $icon[0],
                    instance;
                switch (type) {
                    case 'popover':
                        instance = bootstrap.Popover.getInstance(el);
                        if (instance) { instance.show(); }
                        break;

                    case 'tooltip':
                    /* falls through */
                    default:
                        instance = bootstrap.Tooltip.getInstance(el);
                        if (instance) { instance.show(); }
                        break;
                }
            }
        }
    });

    /**
     * Plugin definition
     * Support backward
     * @deprecated It will be removed soon. Instead of using $(form).bootstrapValidator(), use
     *  $(form).formValidation({
     *      framework: 'bootstrap'  // It's equivalent to use data-fv-framework="bootstrap" for <form>
     *  });
     */
    $.fn.bootstrapValidator = function(option) {
        var params = arguments;
        return this.each(function() {
            var $this   = $(this),
                data    = $this.data('formValidation') || $this.data('bootstrapValidator'),
                options = 'object' === typeof option && option;
            if (!data) {
                data = new FormValidation.Framework.Bootstrap(this, $.extend({}, {
                    events: {
                        // Support backward
                        formInit: 'init.form.bv',
                        formError: 'error.form.bv',
                        formSuccess: 'success.form.bv',
                        fieldAdded: 'added.field.bv',
                        fieldRemoved: 'removed.field.bv',
                        fieldInit: 'init.field.bv',
                        fieldError: 'error.field.bv',
                        fieldSuccess: 'success.field.bv',
                        fieldStatus: 'status.field.bv',
                        localeChanged: 'changed.locale.bv',
                        validatorError: 'error.validator.bv',
                        validatorSuccess: 'success.validator.bv'
                    }
                }, options), 'bv');

                $this.addClass('fv-form-bootstrap')
                     .data('formValidation', data)
                     .data('bootstrapValidator', data);
            }

            // Allow to call plugin method
            if ('string' === typeof option) {
                data[option].apply(data, Array.prototype.slice.call(params, 1));
            }
        });
    };

    $.fn.bootstrapValidator.Constructor = FormValidation.Framework.Bootstrap;
}(jQuery));
