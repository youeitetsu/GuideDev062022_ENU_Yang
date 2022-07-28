namespace Terrasoft.Core.Process
{

	using System;
	using System.Collections.Generic;
	using System.Collections.ObjectModel;
	using System.Drawing;
	using System.Globalization;
	using System.Text;
	using Terrasoft.Common;
	using Terrasoft.Core;
	using Terrasoft.Core.Configuration;
	using Terrasoft.Core.DB;
	using Terrasoft.Core.Entities;
	using Terrasoft.Core.Process;
	using Terrasoft.Core.Process.Configuration;

	#region Class: UsrCaclAveragePriceMethodsWrapper

	/// <exclude/>
	public class UsrCaclAveragePriceMethodsWrapper : ProcessModel
	{

		public UsrCaclAveragePriceMethodsWrapper(Process process)
			: base(process) {
			AddScriptTaskMethod("ScriptTask1Execute", ScriptTask1Execute);
		}

		#region Methods: Private

		private bool ScriptTask1Execute(ProcessExecutingContext context) {
			var esq = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "UsrRealty");
			var priceColumn = esq.AddColumn("UsrPriceUSD");  // select UsPriceUSD as UsrPriceUSD, UsrAreaSqM as UsrAreaSqM from UsrRealty where ...
			var areaColumn = esq.AddColumn("UsrAreaSqM");
			
			Guid typeId = Get<Guid>("RealtyTypeId");
			Guid offerTypeId = Get<Guid>("RealtyOfferTypeId");
			//Guid typeId = new Guid("c6b3599a-2f1d-4316-9d99-1aaa1143718e"); // Apartment realty type
			//Guid offerTypeId = new Guid("53493ce8-b5f2-441e-bfd2-6d254a7ac5c4");  // Sales realty offer type
			
			var typeFilter = esq.CreateFilterWithParameters(FilterComparisonType.Equal, "UsrType", typeId);
			esq.Filters.Add(typeFilter);
			
			var offerTypeFilter = esq.CreateFilterWithParameters(FilterComparisonType.Equal, "UsrOfferType", offerTypeId);
			esq.Filters.Add(offerTypeFilter);
			
			var entityCollection = esq.GetEntityCollection(UserConnection);
			decimal totalUSD = 0;
			decimal totalArea = 0;
			foreach(var entity in entityCollection) {
				decimal price = entity.GetTypedColumnValue<decimal>(priceColumn.Name); // reading using column alias
				decimal area = entity.GetTypedColumnValue<decimal>(areaColumn.Name); // reading using column alias
				totalUSD = totalUSD + price;
				totalArea = totalArea + area;
			}
			
			decimal result = 0;
			if (totalArea > 0) {
				result = totalUSD / totalArea;
			}
			
			Set("AvgPriceUSD", result);
			
			return true;
		}

		#endregion

	}

	#endregion

}

