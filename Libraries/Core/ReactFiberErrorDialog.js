/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *  strict-local
 */

import {handleException, SyntheticError} from './ExceptionsManager';



const ReactFiberErrorDialog = {
  /**
   * Intercept lifecycle errors and ensure they are shown with the correct stack
   * trace within the native redbox component.
   */
  showErrorDialog({componentStack, error: errorValue}) {
    let error;

    // Typically, `errorValue` should be an error. However, other values such as
    // strings (or even null) are sometimes thrown.
    if (errorValue instanceof Error) {
      /* $FlowFixMe[class-object-subtyping] added when improving typing for
       * this parameters */
      error = (errorValue);
    } else if (typeof errorValue === 'string') {
      /* $FlowFixMe[class-object-subtyping] added when improving typing for
       * this parameters */
      error = (new SyntheticError(errorValue));
    } else {
      /* $FlowFixMe[class-object-subtyping] added when improving typing for
       * this parameters */
      error = (new SyntheticError('Unspecified error'));
    }
    try {
      error.componentStack = componentStack;
      error.isComponentError = true;
    } catch {
      // Ignored.
    }

    handleException(error, false);

    // Return false here to prevent ReactFiberErrorLogger default behavior of
    // logging error details to console.error. Calls to console.error are
    // automatically routed to the native redbox controller, which we've already
    // done above by calling ExceptionsManager.
    return false;
  },
};

export default ReactFiberErrorDialog;
