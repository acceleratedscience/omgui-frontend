import BaseApi from '../BaseApi'

// Type declarations
import type { LocationQuery } from 'vue-router'

// - - -

// NOTE - This is OpenAD-specific functionality yet to be integrated!
// - - -
// This API lets us access dataframes that are stored in the magic command API.
// This is exclusively for Jupyter usage and storing of the dataframe happens
// in the main OpenAD repo in /openad/openad_api.py
// - - -
// This is only relevant for commands that refer to dataframes, such as:
// %openad load molecules using dataframe df_data # Load molecules from a dataframe into your working set
// %openad show molset using dataframe my_df # Visualize the molecules from a dataframe
export default class DataframeApi extends BaseApi {
	constructor() {
		super('DataframeApi')
	}

	//
	//

	// Get dataframe data currently stored in the magic command API.
	//
	getDataframe(df_name: string, query: LocationQuery = {}) {
		return this.apiClient.post(`/dataframe/${df_name}`, { query })
	}

	// Update result molset.
	// This overrides the result dataframe stored in memory.
	updateDataframe_molset(df_name: string, cacheId: number) {
		return this.apiClient.post(`/dataframe/update/${df_name}`, { cacheId })
	}

	// Update result data.
	// This overrides the result dataframe stored in memory.
	updateDataframe_data(df_name: string, cacheId: number) {
		// Placeholder for when dataviewer is integrated.
	}
}
