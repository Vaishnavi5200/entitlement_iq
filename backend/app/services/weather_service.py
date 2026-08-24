from datetime import date, timedelta
from typing import List, Dict, Any

class WeatherService:
    @staticmethod
    def get_historical_baseline(project_code: str = "#042") -> Dict[str, Any]:
        """
        Retrieves 10-year meteorological average baseline for project region.
        """
        return {
            "source": "India Meteorological Department (IMD) 10-Year Gridded Dataset / ERA5 Reanalysis",
            "station": "IMD Regional Met Centre, New Delhi / Noida Agro Station",
            "historical_baseline_adverse_days": 8.2,
            "mean_monthly_precipitation_mm": 185.4,
            "criteria": "Daily rainfall > 25.0mm OR sustained wind > 45km/h halting tower crane operations"
        }

    @staticmethod
    def get_daily_weather_observations(project_id: int = 1) -> List[Dict[str, Any]]:
        """
        Controlled realistic daily weather logs for August 2026 for Project #042.
        Exactly 14 adverse days identified across the 31-day monitoring period.
        """
        days_data = []
        
        # Specified adverse weather dates in August 2026 (Total: 14 days):
        # Aug 2, 3, 4 (Heavy Monsoon Depression), Aug 8, 9, 10 (Intense Downpour & Site Flooding),
        # Aug 13, 14, 15, 16 (Continuous Monsoon Inundation), Aug 21, 22 (High Winds & Torrential Rain),
        # Aug 26, 27 (Severe Storm)
        adverse_map = {
            2: {"rain": 42.5, "wind": 38, "reason": "Torrential monsoon downpour (42.5mm); excavation flooded", "site_impact": "Substructure foundation works stopped"},
            3: {"rain": 58.0, "wind": 48, "reason": "Severe rainfall (58mm) & high gusts; safety halt", "site_impact": "Tower crane shut down, site dewatering active"},
            4: {"rain": 34.0, "wind": 30, "reason": "Continuous rain (34mm); waterlogged haul roads", "site_impact": "Ready-mix concrete trucks unable to access"},
            8: {"rain": 62.5, "wind": 52, "reason": "Cloudburst event (62.5mm); severe site inundation", "site_impact": "Basement raft reinforcement submerged"},
            9: {"rain": 45.0, "wind": 40, "reason": "Heavy precipitation (45mm); electrical safety trip", "site_impact": "Site power cut for safety protocols"},
            10: {"rain": 38.5, "wind": 32, "reason": "Adverse rainfall (38.5mm); mud accumulation", "site_impact": "Critical path podium slab casting cancelled (Detection Date)"},
            13: {"rain": 51.0, "wind": 45, "reason": "Monsoon surge (51mm); tower crane wind trip", "site_impact": "Structural steel erection suspended"},
            14: {"rain": 44.0, "wind": 36, "reason": "Persistent rain (44mm); slip hazard", "site_impact": "All external work prohibited by HSE"},
            15: {"rain": 67.0, "wind": 55, "reason": "Extreme gale & downpour (67mm); squall line", "site_impact": "Full site evacuation to muster points"},
            16: {"rain": 31.0, "wind": 28, "reason": "Post-storm saturation (31mm); standing water", "site_impact": "Dewatering pumps running at capacity"},
            21: {"rain": 49.0, "wind": 50, "reason": "High windstorm & rainfall (49mm)", "site_impact": "Tower crane operational limit exceeded"},
            22: {"rain": 36.5, "wind": 34, "reason": "Heavy rainfall (36.5mm); access disruption", "site_impact": "Precast delivery delayed at security gate"},
            26: {"rain": 41.0, "wind": 42, "reason": "Severe convective storm (41mm)", "site_impact": "Facade panel installation halted"},
            27: {"rain": 35.0, "wind": 30, "reason": "Unseasonal downpour (35mm); basement leakage", "site_impact": "Waterproofing team unable to proceed"}
        }

        for day in range(1, 32):
            d = date(2026, 8, day)
            if day in adverse_map:
                info = adverse_map[day]
                days_data.append({
                    "obs_date": d,
                    "rainfall_mm": info["rain"],
                    "wind_kmh": info["wind"],
                    "max_temp_c": 29.5,
                    "is_adverse": True,
                    "adverse_trigger_reason": info["reason"],
                    "site_impact_logged": info["site_impact"]
                })
            else:
                # Normal operational day
                days_data.append({
                    "obs_date": d,
                    "rainfall_mm": round((day * 3.7) % 12.0, 1),
                    "wind_kmh": round(15.0 + (day % 10), 1),
                    "max_temp_c": 33.0,
                    "is_adverse": False,
                    "adverse_trigger_reason": None,
                    "site_impact_logged": "Normal operations proceeding as scheduled"
                })

        return days_data
