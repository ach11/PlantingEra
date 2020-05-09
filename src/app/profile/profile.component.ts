import { Component, OnInit } from "@angular/core";
import { ServerService } from "../server.service";
import { AuthService } from "../auth.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material";
import { EditaccountComponent } from "./editaccount/editaccount.component";
import { EditprofileComponent } from "./editprofile/editprofile.component";
import { Chart } from "angular-highcharts";

export interface TableDataStructure {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: boolean;
  edit: any;
}

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  personalName: string;
  personalEmail: string;
  personalId: number;
  personalUserType: number;
  chart: Chart;

  USER_TYPE = {
    1: "user",
    2: "admin",
    3: "superuser",
  };

  constructor(
    private server: ServerService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {}

  displayedColumns: string[] = [
    "username",
    "first_name",
    "last_name",
    "email",
    "user_type",
  ];
  dataSource: MatTableDataSource<TableDataStructure>;

  ngOnInit() {
    const chart = new Chart({
      chart: {
        type: "column",
      },
      title: {
        text: "Monthly Average Sales",
      },
      subtitle: {
        text: "E-commerce",
      },
      xAxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        crosshair: true,
      },
      yAxis: {
        min: 0,
        title: {
          text: "Amount Of Sales In $",
        },
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
        footerFormat: "</table>",
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
      series: [
        {
          name: "Delhi",
          data: [
            49.9,
            71.5,
            106.4,
            129.2,
            144.0,
            176.0,
            135.6,
            148.5,
            216.4,
            194.1,
            95.6,
            54.4,
          ],
        },
        {
          name: "Bengaluru",
          data: [
            83.6,
            78.8,
            98.5,
            93.4,
            106.0,
            84.5,
            105.0,
            104.3,
            91.2,
            83.5,
            106.6,
            92.3,
          ],
        },
        {
          name: "Mumbai",
          data: [
            48.9,
            38.8,
            39.3,
            41.4,
            47.0,
            48.3,
            59.0,
            59.6,
            52.4,
            65.2,
            59.3,
            51.2,
          ],
        },
        {
          name: "Noida",
          data: [
            42.4,
            33.2,
            34.5,
            39.7,
            52.6,
            75.5,
            57.4,
            60.4,
            47.6,
            39.1,
            46.8,
            51.1,
          ],
        },
      ],
    });
    this.chart = chart;
    const browserChart = new Chart({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: "pie",
      },
      title: {
        text: "Browser market shares in Q2, 2020",
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
      },
      accessibility: {
        point: {
          valueSuffix: "%",
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: false,
          },
          showInLegend: true,
        },
      },
      series: [
        {
          name: "Brands",
          colorByPoint: true,
          data: [
            {
              name: "Chrome",
              y: 61.41,
              sliced: true,
              selected: true,
            },
            {
              name: "Internet Explorer",
              y: 11.84,
            },
            {
              name: "Firefox",
              y: 10.85,
            },
            {
              name: "Other",
              y: 7.05,
            },
          ],
          type: undefined,
        },
      ],
    });
    this.browserChart = browserChart;
    this.server
      .request("GET", "/api/v1/rest-auth/user/")
      .subscribe((user: any) => {
        if (user) {
          this.personalName = user.first_name + user.last_name;
          this.personalEmail = user.email;
          this.personalId = user.id;
          this.personalUserType = user.user_type;
        }
        if (this.personalUserType > 1) {
          this.displayedColumns.push("edit");
        }
      });

    this.server.request("GET", "/api/v1/user/").subscribe((data: any) => {
      if (data) {
        this.dataSource = data.results;
      }
    });
  }

  editAccount(userId: number): void {
    const dialogRef = this.dialog.open(EditaccountComponent, {
      width: "720px",
      data: { userId },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  editProfile(userId: number): void {
    const dialogRef = this.dialog.open(EditprofileComponent, {
      width: "720px",
      data: { userId },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  logout() {
    this.authService.logout();
  }
}
